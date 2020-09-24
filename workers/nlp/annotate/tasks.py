
import logging
import os
import re

import io
from utils.celery_client import celery_app
from utils.list_dir import list_dir
from utils.object import Object
from workers.base_task import ObjectTask
from workers.nlp.annotate.page_annotation import annotate_pages

log = logging.getLogger(__name__)


class AnnotatePagesTask(ObjectTask):

    name = "nlp.annotate_pages"

    def _determine_new_filename(self, from_dir: str):
        # Example:  Finds: [abc_001.txt, abc_002.txt], returns: "abc.xmi"
        regex = re.compile('_[0-9]*$')
        basenames = set()
        for path in list_dir(from_dir):
            name, _ = os.path.splitext(os.path.basename(path))
            basenames.add(regex.sub('', name))
        if len(basenames) != 1:
            raise Exception(f'Ambiguous or underspecified basenames: {basenames}')
        else:
            return '%s.xmi' % basenames.pop()


    def process_object(self, obj: Object):
        """
        Takes the object, searches its data directory for a bunch of
        pages (txt files) and creates a single xmi file with
        the text of the pages as the SofA and the page ranges in annotations.
        """
        representation = self.get_param('representation')
        pages = []
        # This assumes alphanumerically sorted order for the files returned
        for bytes_io in obj.get_representation(representation):
            text = bytes_io.read().decode(encoding="utf8")
            pages.append(text)

        filename = self._determine_new_filename(obj.get_representation_dir(representation))
        content = annotate_pages(pages)
        directory = self.get_param('target')
        obj.add_stream(filename, directory, io.BytesIO(content.encode(encoding="utf8")))


class AnnotateTask(ObjectTask):
    """
    Annotates a given text.

    Annotates the text and stores the annotations in the json.
    """
    name = "nlp.annotate"

    def process_object(self, obj):
        raise Exception("Not implemented yet.")

    def _get_full_text(self, obj):
        """
        Get the full text from the seperated txts.

        Make it to one big string with new-page markers (\f)in it. This
        improves both, quality and runtime of the annotations.

        :param class obj: The object
        :return str: The complete text, merged from all txts
        """
        raise Exception("Not implemented yet.")


AnnotateTask = celery_app.register_task(AnnotateTask())
