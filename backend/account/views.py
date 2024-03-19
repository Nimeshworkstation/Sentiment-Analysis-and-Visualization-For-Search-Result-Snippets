from rest_framework.generics import RetrieveAPIView,ListAPIView
from .models import UserAccount,ImageModel,Study,Result,NextAvailableID,LexiconSentimentAnalysis,Query
from .serializers import CustomUserSerializer,ImageModelSerializer,StudySerializer,QuerySerializer,ResultSerializer,NextAvailableIdSerializer,LexiconSentimentAnalysisSerializer
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .lexicon_based_sentiment_analysis import analyze_sentiment



class CheckEmailExistence(RetrieveAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        email = self.kwargs['email']  # Retrieve the email from URL kwargs
        try:
            user = UserAccount.objects.get(email=email)
            return user
        except UserAccount.DoesNotExist:
            return None

class ImageView(ListAPIView):
    queryset = ImageModel.objects.all()
    serializer_class = ImageModelSerializer
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'count': queryset.count(),  # Total number of images
                'results': serializer.data,  # List of images
            })
    


class CreateStudy(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        study_serializer = StudySerializer(data=request.data.get('study'))
        query_data = request.data.get('query')
        
        if not study_serializer.is_valid():
            return Response({"study_errors": study_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        study_instance = study_serializer.save()
        query_serializer_list = []

        if isinstance(query_data, list):
            for item in query_data:
                query_serializer = QuerySerializer(data=item)
                if query_serializer.is_valid():
                    query_serializer.validated_data['study'] = study_instance
                    query_serializer.save()
                    query_serializer_list.append(query_serializer.data)
                else:
                    study_instance.delete()
                    return Response({"error": query_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            query_serializer = QuerySerializer(data=query_data)
            if query_serializer.is_valid():
                query_serializer.validated_data['study'] = study_instance
                query_serializer.save()
            else:
                study_instance.delete()
                return Response({"error": query_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        # Call the scraping function for the newly created study
        # scrape_study_results(study_instance.id)
        
        response_data = {
            "study": study_serializer.data,
            "queries": query_serializer_list
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class NextAvailableIDView(ListAPIView):
    queryset =  NextAvailableID.objects.all()
    serializer_class = NextAvailableIdSerializer
    permission_classes = [AllowAny]

        

class StudyListView(ListAPIView):
    serializer_class = StudySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        id_param = self.request.query_params.get('id')
        if id_param is not None:
            try:
                study_id = int(id_param)
                queryset = Study.objects.filter(user_id=study_id)
            except ValueError:
                queryset = Study.objects.none()
        else:
            queryset = Study.objects.none()
        return queryset



class CreateResult(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = ResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudyDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, user, study_name, format=None):
        study = get_object_or_404(Study, user=user, study_name=study_name)
        study.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class CheckStudyNameExistence(RetrieveAPIView):
    serializer_class = StudySerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user = self.kwargs['user']
        studyName = self.kwargs['studyName']
        try:
            studyName = Study.objects.get(user=user,study_name=studyName)
            return studyName
        except Study.DoesNotExist:
            return None
        
class ListResults(ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        study_id = self.kwargs['study_id']

        try:
            results = Result.objects.filter(study=study_id)
            return results
        except Result.DoesNotExist:
            return Result.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



from django.http import HttpResponse



class LexiconSentimentAnalysisView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, study_id):
        # List all sentiment analysis data for a specific study
        sentiment_analyses = LexiconSentimentAnalysis.objects.filter(result__study_id=study_id)
        serializer = LexiconSentimentAnalysisSerializer(sentiment_analyses, many=True)
        return Response(serializer.data)

    def post(self, request, study_id):
        # Perform sentiment analysis on POST request
        results = Result.objects.filter(study=study_id)

        for result in results:
            sentiment_analysis, created = LexiconSentimentAnalysis.objects.get_or_create(result=result)

            if created or sentiment_analysis.total_sentiment_score is None:
                sentiment_result = analyze_sentiment(result.snippet)
                sentiment_analysis.total_sentiment_score = sentiment_result['TotalSentimentScore']
                sentiment_analysis.normalized_sentiment_score = sentiment_result['NormalizedSentimentScore']
                sentiment_analysis.sentiment_label = sentiment_result['SentimentLabel']
                sentiment_analysis.save()

        return HttpResponse(f"Lexicon-based sentiment analysis completed for Study ID: {study_id}")



class ListQuery(ListAPIView):
    serializer_class = QuerySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        study_id = self.kwargs['study_id']

        try:
            queriess = Query.objects.filter(study=study_id)
            return queriess
        except Query.DoesNotExist:
            return Query.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)












# def perform_lexiconbased_sentiment_analysis(request, study_id):
#     # Get all Result instances for the specified study_id
#     results = Result.objects.filter(study=study_id)

#     for result in results:
#         # Check if sentiment analysis has already been performed for this result
#         sentiment_analysis, created = LexiconSentimentAnalysis.objects.get_or_create(result=result)

#         if created or sentiment_analysis.total_sentiment_score is None:
#             # Perform lexicon-based sentiment analysis
#             sentiment_result = analyze_sentiment(result.snippet)  # Adjust this based on your data structure
#             sentiment_analysis.total_sentiment_score = sentiment_result['TotalSentimentScore']
#             sentiment_analysis.normalized_sentiment_score = sentiment_result['NormalizedSentimentScore']
#             sentiment_analysis.sentiment_label = sentiment_result['SentimentLabel']
#             sentiment_analysis.save()

#     return HttpResponse("Lexicon-based sentiment analysis completed for Study ID: " + str(study_id))







































































#################################################
# import requests
# from bs4 import BeautifulSoup
# import math

# def get_first_and_last_parent():
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
#     }
#     query = "nuclear power"
#     url = f"https://www.google.com/search?q={query}"
#     response = requests.get(url, headers=headers)
#     response.raise_for_status()

#     soup = BeautifulSoup(response.text, 'lxml')

#     span_tags_with_em = soup.find_all('span', recursive=True)

#     target_span = None
#     for span in span_tags_with_em:
#         em_tag = span.em
#         if em_tag and "Nuclear" in em_tag.get_text():
#             target_span = span
#             break

#     if target_span:
#         first_parent = target_span.parent.get('class', [])
#         last_parent = target_span.parent.parent.parent.parent.get('class', [])
#         return first_parent, last_parent
#     else:
#         return [], []

# def scrape_search_results(query, page, first_div_class, last_div_class):

#     url = f"https://www.google.com/search?q={query}&start={page * 10}"
#     headers = {
#         "User-Agent":  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
#         "Accept-Language": "en-US,en;q=0.9"
#     }
#     response = requests.get(url, headers=headers)
#     response.raise_for_status()
#     soup = BeautifulSoup(response.text, 'lxml')

#     search_results = soup.find_all("div", class_=last_div_class)
#     results = []

#     for result in search_results:
#         url_elem = result.find("a")
#         url = url_elem["href"] if url_elem else None
#         title_elem = result.find("h3")
#         title = title_elem.get_text() if title_elem else None
#         snippet_elem = result.find("div", class_=first_div_class)
#         snippet = snippet_elem.get_text() if snippet_elem else None

#         results.append({"url": url, "title": title, "snippet": snippet})

#     return results

# def scrape_results_up_to_count(queries, num_results_per_query, first_div_class, last_div_class):

#     all_results = {}

#     for query in queries:
#         num_pages = math.ceil(num_results_per_query / 10)
#         results = []

#         for page in range(num_pages):
#             page_results = scrape_search_results(query, page, first_div_class, last_div_class)

#             if len(results) + len(page_results) > num_results_per_query:
#                 page_results = page_results[:num_results_per_query - len(results)]

#             results.extend(page_results)

#         all_results[query] = results

#     return all_results



# def scrape_and_return_results(id):
#     try:
#         study = Study.objects.get(id=id)
#     except Study.DoesNotExist:
#         return JsonResponse({"error": "Study not found"}, status=404)

#     num_results_per_query = study.result_num
#     first_div_class, last_div_class = get_first_and_last_parent()

#     queries = Query.objects.filter(study=study)  # Query related queries using the ForeignKey relationship

#     all_results = {}  # Initialize a dictionary to store results

#     for query in queries:
#         results = scrape_results_up_to_count([query.query_name], num_results_per_query, first_div_class, last_div_class)
#         all_results[query.query_name] = results[query.query_name]

#     # Iterate through the results and save them in the Result model
#     for query_name, query_results in all_results.items():
#         for result in query_results:
#             Result.objects.create(
#                 study=study,
#                 query=query,
#                 url=result['url'],
#                 title=result['title'],
#                 snippet=result['snippet'],
#                 search_engine="google" if study.google_enabled else None  # Set the search engine for the result
#             )




# def scrape_study_results(id):
#     study = Study.objects.get(id=id)
#     google_enabled = study.google_enabled
#     bing_enabled = study.bing_enabled
#     duckduckgo_enabled = study.duckduckgo_enabled
#     search_engines = []
#     if google_enabled:
#         search_engines.append("google")

#     if bing_enabled:
#         search_engines.append("bing")
#     if duckduckgo_enabled:
#         search_engines.append("duckduckgo")

#     # Wrap the search_engines list in a dictionary
#     data = {"search_engines": search_engines}


#     print(search_engines)
#     if not search_engines:
#         return  # No enabled search engines, nothing to scrape

#     for engine in search_engines:
#         if engine == 'google':
#             print('google scraping executed')
#             scrape_and_return_results(id)
#         elif engine == 'bing':
#             print('bing scraping executed')
#         elif engine == 'duckduckgo':
#             print('duckduckgo scraping executed')

#     return JsonResponse(data)

