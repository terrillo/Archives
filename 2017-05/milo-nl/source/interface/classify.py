from nltk import NaiveBayesClassifier as nbc
from nltk.tokenize import word_tokenize
from itertools import chain

import os
import pickle


def classify(test_sentence):

    # Use vocabulary cache
    f = open('./cache/nl_vocabulary.pickle', 'rb')
    vocabulary = pickle.load(f)
    f.close()

    # Use classifier cache
    f = open('./cache/nl_classifier.pickle', 'rb')
    classifier = pickle.load(f)
    f.close()

    featurized_test_sentence =  {i:(i in word_tokenize(test_sentence.lower())) for i in vocabulary}
    return classifier.classify(featurized_test_sentence)
