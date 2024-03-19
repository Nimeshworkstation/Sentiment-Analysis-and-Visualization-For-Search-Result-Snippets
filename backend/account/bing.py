import requests
from bs4 import BeautifulSoup
from .models import Study, Query, Result
from django.http import JsonResponse
import math
import time


def get_bing_first_and_last_parent():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"  # Change the Accept-Language header to prioritize English
    }
    query = "Nature"
    base_url = "https://www.bing.com/search"
    params = {"q": query}
    response = requests.get(base_url, params=params, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'lxml')
    
    p_tags_with_strong = soup.find_all('p', recursive=True)

    # Filter the <p> tags that have an <strong> tag inside them and contain the query
    target_p = None
    for p in p_tags_with_strong:
        strong_tag = p.strong
        if strong_tag and "Nature" in strong_tag.get_text():
            target_p = p
            break

    if target_p:
        first_parent = target_p.get('class', [])
        last_parent = target_p.parent.parent.get('class', [])
        return first_parent, last_parent
    else:
        return [], []

def scrape_bing_results(query, num_results,first_p_class,last_li_class):
    headers = {
        "User-Agent":  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
    }
    base_url = "https://www.bing.com/search"
    params = {"q": query, "count": num_results}
    response = requests.get(base_url, params=params, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'lxml')
    result_items = soup.find_all("li", class_=last_li_class)
    results = []
    for item in result_items:
        title_elem = item.find("h2")
        title = title_elem.get_text() if title_elem else None
        a_elem = item.find("a")
        url = a_elem.get("href") if a_elem else None
        snippet_elem = item.find("p",class_=first_p_class)
        snippet = snippet_elem.get_text() if snippet_elem else None
        results.append({"title": title, "url": url, "snippet": snippet})
    return results

def scrape_results_up_to_count(queries, num_results_per_query, first_div_class, last_div_class):

    all_results = {}

    for query in queries:
        results = []
        num_pages = math.ceil(num_results_per_query / 10)
        num_results_per_query_query = num_results_per_query

        for page in range(num_pages):
            page_results = scrape_bing_results(query, page, first_div_class, last_div_class)

            if len(results) + len(page_results) > num_results_per_query_query:
                page_results = page_results[:num_results_per_query_query - len(results)]

            results.extend(page_results)
            num_results_per_query_query -= len(page_results)

    all_results[query] = results


    return all_results


def scrape_and_return_bing_results(id):
    try:
        study = Study.objects.get(id=id)
    except Study.DoesNotExist:
        return JsonResponse({"error": "Study not found"}, status=404)

    num_results_per_query = study.result_num
    first_p_class, last_li_class = get_bing_first_and_last_parent()

    queries = Query.objects.filter(study=study)
    print('-------------------------------')
    print(queries,first_p_class,last_li_class,study,num_results_per_query)

    all_results = {}
    query_names = [query.query_name for query in queries]

    all_results = scrape_results_up_to_count(query_names, num_results_per_query, first_p_class, last_li_class)

    for query_name, query_results in all_results.items():
        for result in query_results:
            query = Query.objects.get(study=study, query_name=query_name)
            
            # Check if snippet is not None before creating a Result object
            if result['snippet'] is not None:
                Result.objects.create(
                    study=study,
                    query=query,
                    url=result['url'],
                    title=result['title'],
                    snippet=result['snippet'],
                    search_engine="bing" if study.bing_enabled else None
                )
        time.sleep(10)
