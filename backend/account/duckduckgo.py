import requests
from bs4 import BeautifulSoup
import math
from .models import Study,Query,Result
from django.http import JsonResponse
import time

def scrape_search_results(query, num_results):
    print("---------------executed-----------------------")
    print(query)
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36"
}


# Initialize variables to keep track of results
    results = []
    start = 0

# Continue fetching results until reaching the desired number or no more results are available
    while len(results) < num_results:
        # Send a GET request to DuckDuckGo with the query, start parameter, and custom User-Agent header
        url = f"https://duckduckgo.com/html/?q={query}&start={start}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Create a BeautifulSoup object
        soup = BeautifulSoup(response.text, "html.parser")

        # Find all search result items on the page
        result_items = soup.find_all("div", class_="result")

        # Extract the URLs, titles, and snippets from the result items
        for item in result_items:
            title_elem = item.find("a", class_="result__a")
            title = title_elem.get_text() if title_elem else None

            url_elem = item.find("a", class_="result__url")
            url = url_elem.get("href") if url_elem else None

            snippet_elem = item.find("a", class_="result__snippet")
            snippet = snippet_elem.get_text() if snippet_elem else None

            results.append({"title": title, "url": url, "snippet": snippet})

            # Stop fetching if we have reached the desired number of results
            if len(results) >= num_results:
                break

        # Increment the start parameter for the next page of results
        start += len(result_items)
        # time.sleep(20)

    return results






def scrape_and_return_duckduckgo_results(id):
    try:
        study = Study.objects.get(id=id)
    except Study.DoesNotExist:
        return JsonResponse({"error": "Study not found"}, status=404)

    num_results_per_query = study.result_num

    queries = Query.objects.filter(study=study)  # Query related queries using the ForeignKey relationship

    print(queries, num_results_per_query)

    # Extract query names from the queryset
    query_names = [query.query_name for query in queries]
    print("------->",query_names)
# Scrape results for all queries one by one
    for query_name in query_names:
        query_results = scrape_search_results(query_name, num_results_per_query)
        

        # Iterate through the results and save them in the Result model
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
                search_engine="duckduckgo" if study.duckduckgo_enabled else None  # Set the search engine for the result
            )
    time.sleep(20)
        


