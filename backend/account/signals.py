from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Query, Study,Result
from .google import scrape_and_return_google_results
from .bing import scrape_and_return_bing_results 
from .duckduckgo import scrape_and_return_duckduckgo_results # Import your scraping function

import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Query)
def query_created(sender, instance, created, **kwargs):
    if created:
        study = instance.study  # Assuming Query has a ForeignKey to Study
        if study.google_enabled:
            try:
                print(study.id)  # Get the associated Study's ID
                print('google scraping executed')
                scrape_and_return_google_results(study.id)
            except Exception as e:
                logger.error(f"Error scraping results for Study ID {study.id}: {e}")
        if study.duckduckgo_enabled:
            try:
                print(study.id)  # Get the associated Study's ID
                print('duckduckgo scraping executed')
                scrape_and_return_duckduckgo_results(study.id) 
            except Exception as e:
                logger.error(f"Error scraping results for Study ID {study.id}: {e}")

        if study.bing_enabled:
            try:
                print(study.id)  # Get the associated Study's ID
                print('bing scraping executed')
                scrape_and_return_bing_results(study.id)
            except Exception as e:
                logger.error(f"Error scraping results for Study ID {study.id}: {e}")

@receiver(post_save, sender=Result)
def results_saved_handler(sender,instance,created, **kwargs):
    if created:
        print('Results are saved')
