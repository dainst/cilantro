FROM ubuntu:18.04

MAINTAINER Deutsches Archäologisches Institut "dev@dainst.de"

RUN apt-get update && apt-get upgrade -y && \
      apt-get install -y \
      wget \
      unzip \
      default-jre \
      locales \
      python3 \
      python3-pip \
      git
RUN apt-get clean && apt-get autoremove

RUN rm -rf /var/lib/apt/lists/*
RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV LANG LANG=en_US.UTF-8

# Install Treetagger for nlp_components
ENV TREETAGGER_ROOT /opt/bin/treetagger
ENV TREETAGGER_HOME $TREETAGGER_ROOT/cmd
ENV PATH $PATH:$TREETAGGER_ROOT/bin/:$TREETAGGER_ROOT/cmd/

RUN mkdir /opt/bin
RUN mkdir $TREETAGGER_ROOT
WORKDIR $TREETAGGER_ROOT

RUN wget --no-verbose http://www.cis.uni-muenchen.de/~schmid/tools/TreeTagger/data/tree-tagger-linux-3.2.1.tar.gz
RUN wget --no-verbose http://www.cis.uni-muenchen.de/%7Eschmid/tools/TreeTagger/data/tagger-scripts.tar.gz
RUN wget --no-verbose http://www.cis.uni-muenchen.de/%7Eschmid/tools/TreeTagger/data/german.par.gz
RUN wget --no-verbose http://www.cis.uni-muenchen.de/%7Eschmid/tools/TreeTagger/data/english.par.gz
RUN wget --no-verbose http://www.cis.uni-muenchen.de/%7Eschmid/tools/TreeTagger/data/install-tagger.sh
RUN sh install-tagger.sh

# Install Stanford NER  for nlp_components
ENV STANFORDHOME=/opt/bin/stanford_ner
ENV CLASSPATH=$CLASSPATH:$STANFORDHOME/stanford-ner.jar
ENV STANFORD_MODELS=$STANFORDHOME/models:$STANFORDHOME/classifiers
RUN mkdir $STANFORDHOME

WORKDIR /tmp
RUN wget --no-verbose https://nlp.stanford.edu/software/stanford-ner-2015-12-09.zip
RUN unzip stanford-ner-2015-12-09.zip
RUN mv stanford-ner-2015-12-09/* $STANFORDHOME
RUN rm stanford-ner-2015-12-09.zip

RUN wget --no-verbose http://nlp.dainst.org/html/nerclass/english.all.3class.distsim.crf.ser.gz -P $STANFORDHOME/classifiers
RUN wget --no-verbose http://nlp.dainst.org/html/nerclass/german.hgc_175m_600.crf.ser.gz -P $STANFORDHOME/classifiers
RUN wget --no-verbose http://nlp.dainst.org/html/nerclass/ner-ita-nogpe-noiob_gaz_wikipedia_sloppy.ser.gz -P $STANFORDHOME/classifiers
RUN wget --no-verbose http://nlp.dainst.org/html/nerclass/spanish.ancora.distsim.s512.crf.ser.gz -P $STANFORDHOME/classifiers

# Install Geoparser for nlp_components
## ATTENTION: The geoparser home folder is currently hardcoded in nlp_components
ENV GEOPARSER_HOME=/opt/nlp
RUN wget --no-verbose http://nlp.dainst.org/html/geo/geoparser-march2016.zip
RUN unzip geoparser-march2016.zip
RUN rm geoparser-march2016.zip
RUN mv geoparser-march2016 $GEOPARSER_HOME

# Python 3 dependencies for nlp_components
RUN pip3 install \
    NLTK \
    lxml \
    requests \
    langid \
    git+https://github.com/miotto/treetagger-python.git \
    pytest

RUN python3 -m nltk.downloader -d /usr/local/share/nltk_data punkt

ENV PYLIB /usr/local/lib/python3.6/dist-packages

ARG GITHUB_ACCESS_TOKEN
RUN export GITHUB_ACCESS_TOKEN=$GITHUB_ACCESS_TOKEN

RUN git clone https://x-access-token:${GITHUB_ACCESS_TOKEN}@github.com/dainst/nlp_components.git $PYLIB/nlp_components
RUN cp -R $PYLIB/nlp_components/idai_journals $PYLIB/idai_journals
# Kind of ugly, need to find a better way for adding a path to python
# inside of docker, except of copying it into it. Export does not work.

ENV LIBARY_PATH=/lib:/usr/lib
ENV PIPENV_VENV_IN_PROJECT=true
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

# workaround for pipenv bug: https://github.com/pypa/pipenv/issues/1328
RUN set -ex && mkdir /app

COPY ./utils /app/utils
COPY ./workers /app/workers
WORKDIR /app

COPY docker/cilantro-nlp-worker/Pipfile Pipfile
COPY docker/cilantro-nlp-worker/entrypoint.sh /entrypoint.sh

RUN pip3 install pipenv
RUN set -ex && pipenv lock && pipenv install --deploy --system

COPY docker/cilantro-nlp-worker/VERSION .

ENTRYPOINT bash /entrypoint.sh
