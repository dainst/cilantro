import os
from abc import abstractmethod

from utils.celery_client import celery_app
from workers.base_task import BaseTask

from utils.object import Object

from workers.convert.convert_image import convert_tif_to_jpg
from workers.convert.convert_pdf import convert_pdf_to_txt, split_merge_pdf
from workers.convert.convert_image_pdf import convert_pdf_to_tif, \
    convert_jpg_to_pdf
from workers.convert.tif_to_txt import tif_to_txt


class ConvertTask(BaseTask):
    """
    Abstract base class for conversion tasks.
    """

    def execute_task(self):
        file = self.get_param('file')
        target_rep = self.get_param('target')
        target_dir = os.path.join(self.get_work_path(),
                                  Object.DATA_DIR, target_rep)
        os.makedirs(target_dir, exist_ok=True)
        self.process_file(file, target_dir)

    @abstractmethod
    def process_file(self, file, target_dir):
        """
        Process a single file.

        This method has to be implemented by all subclassed tasks and includes
        the actual implementation logic of the specific task.

        :param str file: The path to the file that should be processed
        :param str target_dir: The path of the target directory
        :return None:
        """
        raise NotImplementedError("Process file method not implemented")


class SplitPdfTask(BaseTask):
    """
    Split multiple pdfs from the working dir.

    TaskParams:
    -list files_to_split: list of the files as dictionnaries {'file': file_name, 'range': [start, end]}

    Preconditions:
    -files from files_to_split in the working dir.

    Creates:
    -for each article:
        -file_name.article_nr.pdf in the working dir.
    """
    name = "convert.split_pdf"

    def execute_task(self):
        obj = Object(self.get_work_path())
        rel_files = _extract_basename(self.get_param('files'))
        _split_pdf_for_object(obj, rel_files)
        parts = self.get_param('parts')
        for part in parts:
            self._execute_for_child(obj.get_child(parts.index(part) + 1), part)

    def _execute_for_child(self, obj, part):
        _split_pdf_for_object(obj, _extract_basename(part['files']))
        if 'parts' in part:
            parts = part['parts']
            for subpart in parts:
                self._execute_for_child(obj.get_child(parts.index(subpart) + 1), subpart)


def _extract_basename(files):
    for file in files:
        file['file'] = os.path.basename(file['file'])
    return files


def _split_pdf_for_object(obj, files):
    pdf_files = []
    for file in files:
        suffix = (file['file']).split('.')[-1]
        if suffix == 'pdf':
            pdf_files.append(file)
    if len(pdf_files) > 0:
        rep_dir = obj.get_representation_dir(Object.INITIAL_REPRESENTATION)
        split_merge_pdf(pdf_files, rep_dir)


class JpgToPdfTask(ConvertTask):
    """
    Create a one paged pdf with a jpg.

    TaskParams:
    -str file: jpg file to be turned into pdf

    Preconditions:
    -file in the working dir.

    Creates:
    -file_name.converted.pdf in the working dir.
    """
    name = "convert.jpg_to_pdf"

    def process_file(self, file, target_dir):
        _, extension = os.path.splitext(file)
        new_name = os.path.basename(file).replace(extension, '.converted.pdf')
        target_file = os.path.join(target_dir, new_name)
        convert_jpg_to_pdf(file, target_file)


class TifToJpgTask(ConvertTask):
    """
    Create a jpg file from a tif.

    TaskParams:
    -str file: tif file to be turned into jpg

    Preconditions:
    -file in the working dir.

    Creates:
    -file_name.jpg in the working dir.
    """
    name = "convert.tif_to_jpg"

    def process_file(self, file, target_dir):
        _, extension = os.path.splitext(file)
        new_name = os.path.basename(file).replace(extension, '.jpg')
        target_file = os.path.join(target_dir, new_name)
        convert_tif_to_jpg(file, target_file)


class PdfToTxtTask(ConvertTask):
    """
    Create a txt file for every page in a pdf.

    TaskParams:
    -str file: pdf file to be turned into txt files

    Preconditions:
    -file in the working dir.

    Creates:
    -for each page in file:
        -page.index.txt
    """
    name = "convert.pdf_to_txt"

    def process_file(self, file, target_dir):
        convert_pdf_to_txt(file, target_dir)


class PdfToTifTask(ConvertTask):
    """
    Create a tif file for every page of a pdf.

    TaskParams:
    -str file: pdf file to be turned into tif files

    Preconditions:
    -file in the working dir.

    Creates:
    -for each page in file:
        -index.tif
    """
    name = "convert.pdf_to_tif"

    def process_file(self, file, target_dir):
        convert_pdf_to_tif(file, target_dir)


class MergeConvertedPdfTask(BaseTask):
    """
    Take all the .converted.pdf files in the workspace and merge them into one.

    TaskParams:

    Preconditions:

    Creates:
    -merged.pdf in the working dir
    """
    name = "convert.merge_converted_pdf"

    def execute_task(self):
        rep = self.get_param('representation')
        rep_dir = os.path.join(self.get_work_path(),  Object.DATA_DIR, rep)
        files = [{'file': os.path.basename(f)}
                 for f in _list_files(rep_dir, '.converted.pdf')]
        split_merge_pdf(files, rep_dir)


class TxtToTifTask(ConvertTask):
    """
    Create a txt file from a tif.

    TaskParams:
    -str file: tif file to be turned into txt

    Preconditions:
    -file in the working dir.

    Creates:
    -file_name.converted.txt
    """
    name = "convert.tif_to_txt"

    def process_file(self, file, target_dir):
        _, extension = os.path.splitext(file)
        new_name = os.path.basename(file).replace(extension, '.txt')
        target_file = os.path.join(target_dir, new_name)
        tif_to_txt(file, target_file)


def _list_files(directory, extension):
    return (directory + "/" + f for f in os.listdir(directory)
            if f.endswith(extension))


SplitPdfTask = celery_app.register_task(SplitPdfTask())
JpgToPdfTask = celery_app.register_task(JpgToPdfTask())
MergeConvertedPdf = celery_app.register_task(MergeConvertedPdfTask())
TifToJpgTask = celery_app.register_task(TifToJpgTask())
PdfToTifTask = celery_app.register_task(PdfToTifTask())
PdfToTxtTask = celery_app.register_task(PdfToTxtTask())
TxtFromTifTask = celery_app.register_task(TxtToTifTask())
