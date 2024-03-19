import requests
from bs4 import BeautifulSoup
import math
from .models import Study,Query,Result
from django.http import JsonResponse
import time

def get_first_and_last_parent():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
    }
    query = "nuclear power"
    url = f"https://www.google.com/search?q={query}"
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'lxml')

    span_tags_with_em = soup.find_all('span', recursive=True)

    target_span = None
    for span in span_tags_with_em:
        em_tag = span.em
        if em_tag and "Nuclear" in em_tag.get_text():
            target_span = span
            break

    if target_span:
        first_parent = target_span.parent.get('class', [])
        last_parent = target_span.parent.parent.parent.parent.get('class', [])
        return first_parent, last_parent
    else:
        return [], []

def scrape_search_results(query, page, first_div_class, last_div_class):

    url = f"https://www.google.com/search?q={query}&start={page * 10}"
    headers = {
        "User-Agent":  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')

    search_results = soup.find_all("div", class_=last_div_class)
    results = []

    for result in search_results:
        url_elem = result.find("a")
        url = url_elem.get("href") if url_elem else None
        title_elem = result.find("h3")
        title = title_elem.get_text() if title_elem else None
        snippet_elem = result.find("div", class_=first_div_class)
        snippet = snippet_elem.get_text() if snippet_elem else None

        results.append({"url": url, "title": title, "snippet": snippet})

    return results

def scrape_results_up_to_count(queries, num_results_per_query, first_div_class, last_div_class):

    all_results = {}

    for query in queries:
        results = []
        num_pages = math.ceil(num_results_per_query / 10)
        num_results_per_query_query = num_results_per_query

        for page in range(num_pages):
            page_results = scrape_search_results(query, page, first_div_class, last_div_class)

            if len(results) + len(page_results) > num_results_per_query_query:
                page_results = page_results[:num_results_per_query_query - len(results)]

            results.extend(page_results)
            num_results_per_query_query -= len(page_results)

    all_results[query] = results


    return all_results




def scrape_and_return_google_results(id):
    try:
        study = Study.objects.get(id=id)
    except Study.DoesNotExist:
        return JsonResponse({"error": "Study not found"}, status=404)

    num_results_per_query = study.result_num
    first_div_class, last_div_class = get_first_and_last_parent()

    queries = Query.objects.filter(study=study)  # Query related queries using the ForeignKey relationship

    all_results = {}  # Initialize a dictionary to store results
    print(queries, num_results_per_query, first_div_class, last_div_class)

    # Extract query names from the queryset
    query_names = [query.query_name for query in queries]

    # Scrape results for all queries in one call
    all_results = scrape_results_up_to_count(query_names, num_results_per_query, first_div_class, last_div_class)

    # Iterate through the results and save them in the Result model
    for query_name, query_results in all_results.items():
        for result in query_results:
            query = Query.objects.get(study=study, query_name=query_name)  # Get the query object

            # Check if snippet is not None before creating a Result object
            if result['snippet'] is not None:
                Result.objects.create(
                    study=study,
                    query=query,
                    url=result['url'],
                    title=result['title'],
                    snippet=result['snippet'],
                    search_engine="google" if study.google_enabled else None  # Set the search engine for the result
                )
        time.sleep(20)
