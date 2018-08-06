import os

from utils.celery_client import celery_app
from workers.base_task import BaseTask
from workers.convert.convert_image import convert_tif_to_jpg
from workers.convert.convert_pdf import convert_pdf_to_txt, split_merge_pdf
from workers.convert.convert_image_pdf import convert_pdf_to_tif, \
    convert_jpg_to_pdf
from workers.convert.tif_to_txt import tif_to_txt


class JpgToPdfTask(BaseTask):
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

    def execute_task(self):
        file = self.get_param("file")
        if file is None:
            raise Exception('NO FILE')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.converted.pdf')
        convert_jpg_to_pdf(file, new_file)


class TifToJpgTask(BaseTask):
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

    def execute_task(self):
        file = self.get_param('file')
        _, extension = os.path.splitext(file)
        new_file = file.replace(extension, '.jpg')
        convert_tif_to_jpg(file, new_file)


class PdfToTxtTask(BaseTask):
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

    def execute_task(self):
        file = self.get_param('file')
        convert_pdf_to_txt(file, os.path.join(os.path.dirname(os.path.dirname(file)), 'txt'))


class PdfToTifTask(BaseTask):
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

    def execute_task(self):
        file = self.get_param('file')
        convert_pdf_to_tif(file, self.get_work_path())


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
        work_path = self.get_work_path()
        files = [{'file': os.path.join(work_path, f)} for f in _list_files(work_path, '.converted.pdf')]
        split_merge_pdf(files, work_path)


class TxtToTifTask(BaseTask):
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

    def execute_task(self):
        file_name = self.get_param("file")
        file = os.path.join(self.get_work_path(), file_name)
        tif_to_txt(file, os.path.join(self.get_work_path(), file_name + '.converted.txt'))


def _list_files(directory, extension):
    return (directory + "/" + f for f in os.listdir(directory)
            if f.endswith(extension))


JpgToPdfTask = celery_app.register_task(JpgToPdfTask())
MergeConvertedPdf = celery_app.register_task(MergeConvertedPdfTask())
TifToJpgTask = celery_app.register_task(TifToJpgTask())
PdfToTifTask = celery_app.register_task(PdfToTifTask())
PdfToTxtTask = celery_app.register_task(PdfToTxtTask())
TxtFromTifTask = celery_app.register_task(TxtToTifTask())
