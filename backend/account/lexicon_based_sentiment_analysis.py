import nltk
import re
import math
from nltk.tokenize import word_tokenize
from nltk.corpus import sentiwordnet as swn
from nltk.corpus import stopwords
from nltk.corpus import wordnet as wn
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from nltk.stem import PorterStemmer
import pandas as pd
import numpy as np
import joblib
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('sentiwordnet')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')
import os

model_path = r'C:\Users\nimes\OneDrive\Desktop\completeauth\backend\account\sentiment_analysis_model.joblib'

if os.path.exists(model_path):
    svm_model = joblib.load(open(model_path, 'rb'))
else:
    print("Model file not found:", model_path)

custom_stopwords = ["my", "me", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "other", "some", "such", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]

def preprocess(sentence):
    # Replace NaN values with an empty string
    sentence = '' if pd.isna(sentence) else sentence
    tokenized_sentence = word_tokenize(sentence)
    
    # Remove non-alphabetic characters from each word
    tokenized_sentence = ["".join(c for c in word if c.isalpha()) for word in tokenized_sentence]
    
    # Remove stopwords
    filtered_sentence = [word for word in tokenized_sentence if word.lower() not in custom_stopwords]

    
    # Join the processed words back into a sentence
    processed_sentence = ' '.join(filtered_sentence)  # You can use lemmatized_sentence if you prefer lemmatization
    
    return processed_sentence
def remove_special_characters(text):
    # Define the regex pattern to match special characters
    quote = r'[,"]'
    cleaned_text = re.sub(quote, ' ', text)
    special_char_pattern = r'[^\w\s<>\"]'
    cleaned_text1 = re.sub(special_char_pattern, ' ', cleaned_text)
    # Replace multiple spaces with a single space
    cleaned_text2 = re.sub(r'\s+', ' ', cleaned_text1)
    return cleaned_text2

def remove_urls_and_special_characters(text):
    if text is not None:
        # Define the regex pattern to match URLs
        url_pattern = re.compile(r'https?://\S+|www\.\S+')

        # Replace URLs with an empty string
        text_without_urls = re.sub(url_pattern, ' ', text)

        # Remove special characters and replace multiple spaces from the text
        text_without_special_chars = remove_special_characters(text_without_urls)

        return text_without_special_chars
    else:
        # Handle the case where text is None
        return 'empty'  # or any other appropriate action

def casefolding_text(text):
    if text is not None:
        text_lower = text.casefold()
        return text_lower
    else:
        # Handle the case where text is None
        return 'empty'  # or any other appropriate action

def convert_pos_tag(pos_tag):
    """
    Convert POS tags from Penn Treebank to SentiWordNet format.
    """
    if pos_tag.startswith('NN'):
        return 'n'
    elif pos_tag.startswith('VB'):
        return 'v'
    elif pos_tag.startswith('JJ'):
        return 'a'
    elif pos_tag.startswith('RB'):
        return 'r'
    else:
        return 'n'

def analyze_sentiment(text):
    adverbs = ['very', 'really', 'extremely', 'simply', 'always', 'absolutely', 'highly', 'overall', 'truly', 'too']
    adverbs1 = ['outweigh','not', 'no', 'never', 'against', 'lack', 'lack of', 'absence', 'absence of', 'without', 'however', 'because','mitigate']
    cleaned_data = remove_urls_and_special_characters(text)
    casefolded_data = casefolding_text(cleaned_data)
    sentiment_scores = []
    total_sentiment_score = 0  # Initialize total sentiment score
    tokens = nltk.word_tokenize(casefolded_data)
    pos_tags = nltk.pos_tag(tokens)
    stop_words = set(stopwords.words('english'))
    words_to_remove = ['very', 'really', 'extremely', 'simply', 'always', 'absolutely', 'highly', 'overall', 'truly', 'too' ,"very", "most", "more", "not", "no", "too", "against",'not', 'no', 'never', 'against', 'lack', 'lack of', 'absence', 'absence of', 'without', 'however', 'because','mitigate']
    for word in words_to_remove:
        stop_words.discard(word)
    for token, pos_tag in pos_tags:
        if token.lower() not in stop_words:
            wordnet_pos = convert_pos_tag(pos_tag) or 'n'  # Default to noun if POS tag is None
            average_negativity = 0.0
            average_positivity = 0.0
            try:
                lemma = WordNetLemmatizer().lemmatize(token, pos=wordnet_pos)
                synsets = list(swn.senti_synsets(lemma, pos=wordnet_pos))
                if not synsets:
                    synsets = list(swn.senti_synsets(lemma))
                    if not synsets:
                        synonyms = wn.synsets(lemma)
                        for syn in synonyms:
                            synsets.extend(swn.senti_synsets(syn.name()))

                if synsets:
                    positivity_scores = [synset.pos_score() for synset in synsets]
                    negativity_scores = [synset.neg_score() for synset in synsets]
                    average_positivity = sum(positivity_scores) / len(positivity_scores)
                    average_negativity = sum(negativity_scores) / len(negativity_scores)
                    sentiment_score = average_positivity - average_negativity
                else:
                    sentiment_score = 0.0
                sentiment_scores.append({
                    'Word': token,
                    'POS': pos_tag,
                    'Positivity': average_positivity,
                    'Negativity': average_negativity,
                    'SentimentScore': sentiment_score
                })
                if token.lower() not in adverbs and token.lower() not in adverbs1:
                    total_sentiment_score += sentiment_score

            except KeyError:
                continue

    flag = False            
    for i in range(len(sentiment_scores)):
        current_word = sentiment_scores[i]['Word']
        if i < len(sentiment_scores) - 2:
            next_word = sentiment_scores[i+1]['Word']
            next_next_word = sentiment_scores[i+2]['Word']
            next_next_pos = sentiment_scores[i+2]['POS']
            next_pos = convert_pos_tag(next_next_pos)
            if current_word in adverbs1 and next_word in adverbs and next_pos in ['a', 'v']:
                print("executed third logic")
                flag = True
                next_word_sentiment_score = sentiment_scores[i + 2]['SentimentScore']  # Adjust the index accordingly
                if next_word_sentiment_score > 0:

                    # Calculate the sentiment scores for "very good"

                    sentiment_scores[i+1]['Positivity'] = 0
                    sentiment_scores[i+1]['Negativity'] = 0
                    sentiment_scores[i+1]['SentimentScore'] = 0
                    temp_v = sentiment_scores[i + 2]['SentimentScore']
                    temp_v*=2
                    temp_very = temp_v


                    # Calculate the sentiment scores for "not good"
                    temp_not_positive = sentiment_scores[i + 2]['Positivity']
                    temp_not_negative = sentiment_scores[i + 2]["Negativity"]
                    temp = temp_not_positive
                    temp_not_positive = temp_not_negative
                    temp_not_negative = temp
                    sentiment_scores[i]['Positivity'] = 0
                    sentiment_scores[i]['Negativity'] = 0
                    sentiment_scores[i]['SentimentScore'] = 0
                    sentiment_scores[i + 2]['Positivity'] = temp_not_positive
                    sentiment_scores[i + 2]['Negativity'] = temp_not_negative
                    temp_not = sentiment_scores[i + 2]['SentimentScore']



                    # Multiply and square root the sentiment scores
                    combined_score = temp_not * temp_very
                    temp = combined_score
                    temp **= 0.5
                    combined_score = temp

                    sentiment_scores[i + 2]['SentimentScore'] = combined_score
                    sentiment_scores[i]['SentimentScore'] = 0
                    sentiment_scores[i + 1]['SentimentScore'] = 0

                elif next_word_sentiment_score < 0:

                    # Calculate the sentiment scores for "very bad"
                    sentiment_scores[i+1]['Positivity'] = 0
                    sentiment_scores[i+1]['Negativity'] = 0
                    sentiment_scores[i+1]['SentimentScore'] = 0
                    temp_v = sentiment_scores[i + 2]['SentimentScore']
                    temp_vv= abs(temp_v)
                    temp_vv**=0.5
                    temp_very = -temp_vv


                    # Calculate the sentiment scores for "not bad"
                    temp_not_positive = sentiment_scores[i + 2]['Positivity']
                    temp_not_negative = sentiment_scores[i + 2]["Negativity"]
                    temp = temp_not_positive
                    temp_not_positive = temp_not_negative
                    temp_not_negative = temp
                    sentiment_scores[i]['Positivity'] = 0
                    sentiment_scores[i]['Negativity'] = 0
                    sentiment_scores[i]['SentimentScore'] = 0
                    sentiment_scores[i + 2]['Positivity'] = temp_not_positive
                    sentiment_scores[i + 2]['Negativity'] = temp_not_negative
                    temp_not = sentiment_scores[i + 2]['SentimentScore']

                    # Multiply and square root the sentiment scores
                    combined_score = temp_not * temp_very
                    temp = combined_score
                    temp **= 0.5
                    combined_score = -temp

                    sentiment_scores[i + 2]['SentimentScore'] = combined_score
                    sentiment_scores[i]['SentimentScore'] = 0
                    sentiment_scores[i + 1]['SentimentScore'] = 0
                # Recalculate total_sentiment_score
        total_sentiment_score = 0
        for score in sentiment_scores:
            word = score['Word'].lower()
            if word not in adverbs and word not in adverbs1:
                total_sentiment_score += score['SentimentScore']
        
    if not flag: 
        for i in range(len(sentiment_scores)):
            current_word = sentiment_scores[i]['Word']
            if i < len(sentiment_scores) - 1:
                pos = sentiment_scores[i + 1]['POS']
                next_pos = convert_pos_tag(pos)
                if current_word in adverbs and (next_pos == 'a' or next_pos == 'v'):
                    print("executed first logic")
                    next_word_sentiment_score = sentiment_scores[i + 1]['SentimentScore']
                    if next_word_sentiment_score > 0:
                        sentiment_scores[i]['Positivity'] = 0
                        sentiment_scores[i]['Negativity'] = 0
                        sentiment_scores[i]['SentimentScore'] = 0
                        temp = sentiment_scores[i + 1]['SentimentScore']
                        temp*= 2
                        sentiment_scores[i+1]['SentimentScore']=temp
                    elif next_word_sentiment_score < 0:
                        temp = sentiment_scores[i + 1]['SentimentScore']
                        temp1 = abs(temp)
                        temp1 **= 0.5
                        sentiment_scores[i + 1]['SentimentScore'] = -temp1
                        sentiment_scores[i]['Positivity'] = 0
                        sentiment_scores[i]['Negativity'] = 0
                        sentiment_scores[i]['SentimentScore'] = 0

                if current_word in adverbs1 and (next_pos == 'a' or next_pos == 'v'):
                    print("executed second logic")
                    next_word_positive_score = sentiment_scores[i + 1]['Positivity']
                    next_word_negative_score = sentiment_scores[i + 1]['Negativity']
                    temp = next_word_positive_score
                    next_word_positive_score = next_word_negative_score
                    next_word_negative_score = temp
                    sentiment_scores[i]['Positivity'] = 0
                    sentiment_scores[i]['Negativity'] = 0
                    sentiment_scores[i]['SentimentScore'] = 0
                    sentiment_scores[i + 1]['Positivity'] = next_word_positive_score
                    sentiment_scores[i + 1]['Negativity'] = next_word_negative_score
                    sentiment_scores[i + 1]['SentimentScore'] = next_word_positive_score - next_word_negative_score
            # Recalculate total_sentiment_score
            total_sentiment_score = 0
            for score in sentiment_scores:
                word = score['Word'].lower()
                if word not in adverbs and word not in adverbs1:
                    total_sentiment_score += score['SentimentScore']






    normalized = math.tanh(total_sentiment_score)
    print("normalized vlaue after 1 to -1 is :",normalized)
    normalized_value = (normalized - (-1)) / (1 - (-1)) * (5 - 1) + 1
    print("normalized value between 1 to -1",normalized_value)
    if total_sentiment_score!= 0:
        value = normalized_value
    elif total_sentiment_score == 0:
        value = 3
    else:
        processed_unlabeled_sentence = preprocess(text)
        prediction = svm_model.predict([processed_unlabeled_sentence])
        if prediction == 1:
            value = 2
        elif prediction == 2:
            value = 3
        else:
            value = 4  

    if value > 3.25:
        sentiment_label = 'Positive'
    elif value == 0:
        sentiment_label = "Neutral"
    elif value < 2.85:
        sentiment_label = 'Negative'

    else:
        sentiment_label = 'Neutral'

    return {
        'SentimentScores': sentiment_scores,
        'TotalSentimentScore': total_sentiment_score,
        'NormalizedSentimentScore': value,
        'SentimentLabel': sentiment_label
    }


text = "bad  good "
sentiment_analysis_results = analyze_sentiment(text)
print(sentiment_analysis_results)