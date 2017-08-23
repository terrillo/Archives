from nltk import NaiveBayesClassifier as nbc
from nltk.tokenize import word_tokenize
from itertools import chain

import os
import csv
import json
import pickle

# Fetch Datasets
training_data = []
source = './datasets/'
for root, dirs, datasets in os.walk(source):
    for dataset in datasets:
        dataset_full_path = os.path.join(source, dataset)
        with open(dataset_full_path) as f:
            reader = csv.DictReader(f)
            rows = list(reader);
            for row in rows:
                example = row['example']
                context = row['context']
                training_data.append((example, context))

# Build vocabulary, feature_set, and classifier
vocabulary = set(chain(*[word_tokenize(i[0].lower()) for i in training_data]))
feature_set = [({i:(i in word_tokenize(sentence.lower())) for i in vocabulary},tag) for sentence, tag in training_data]
classifier = nbc.train(feature_set)

# Cache vocabulary
f = open('./cache/nl_vocabulary.pickle', 'wb')
pickle.dump(vocabulary, f)
f.close()

# cache classifier
f = open('./cache/nl_classifier.pickle', 'wb')
pickle.dump(classifier, f)
f.close()
