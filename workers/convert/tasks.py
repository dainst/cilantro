import os

from utils.celery_client import celery_app
from workers.base_task import ObjectTask, FileTask
from utils.object import Object
from workers.convert.convert_image import convert_tif_to_jpg, \
    convert_jpg_to_pdf, tif_to_txt, convert_tif_to_ptif, tif_to_pdf
from workers.convert.convert_pdf import convert_pdf_to_txt, split_merge_pdf, \
    convert_pdf_to_tif, set_pdf_metadata
from workers.convert.image_scaling import scale_image


def _extract_basename(files):
    for file in files:
        file['file'] = os.path.basename(file['file'])
    return files


def _list_files(directory, extension):
    return (directory + "/" + f for f in os.listdir(directory)
            if f.endswith(extension))


def _get_target_file(file, target_dir, target_extension):
    _, extension = os.path.splitext(file)
    new_name = os.path.basename(file).replace(extension,
                                              f".{target_extension}")
    return os.path.join(target_dir, new_name)


class MergeConvertedPdfTask(ObjectTask):
    """
    Merge all pdf files in a representation into one.

    TaskParams:
    -representation: The name of the representation

    Preconditions:
    - Files need to be named in alphabetical order

    Creates:
    -merged.pdf in the given representation
    """

    name = "convert.merge_converted_pdf"
    label = "Merge converted PDF"
    description = "Merges individual PDF files into one."

    def process_object(self, obj):
        rep_dir = os.path.join(self.get_work_path(), Object.DATA_DIR, 'pdf')
        files = [{'file': os.path.basename(f)}
                 for f in sorted(_list_files(rep_dir, '.pdf'))]

        split_merge_pdf(
            files, rep_dir, f"{obj.id}.pdf")


class SetPdfMetadataTask(ObjectTask):
    """
    Sets PDF Metadata for a given object.
    """
    name = "convert.set_pdf_metadata"
    label = "Set PDF metadata"
    description = "Sets PDF metadata based"

    def process_object(self, obj):
        set_pdf_metadata(obj)


class JpgToPdfTask(FileTask):
    """
    Create a one paged pdf with a jpg.

    TaskParams:
    -str file: Path to a jpg file that should be converted to pdf
    -str target: Name of the representation the created file will be added to

    Preconditions:
    -file in the representation

    Creates:
    -<file_name>.pdf in the working dir.
    """

    name = "convert.jpg_to_pdf"
    label = "Convert JPG to PDF"
    description = "Converts JPG files into PDF files."

    def process_file(self, file, target_dir):
        convert_jpg_to_pdf(file, _get_target_file(file, target_dir, 'pdf'))


class TifToPdfTask(FileTask):
    name = "convert.tif_to_pdf"
    label = "Convert TIF to PDF"
    description = "Converts TIF files into PDF files."

    def process_file(self, file, target_dir):
        tif_to_pdf(file, _get_target_file(file, target_dir, 'pdf'))


class TifToJpgTask(FileTask):
    """
    Create a jpg file from a tif.

    TaskParams:
    -str file: Path to the tif file
    -str target: Name of the representation the created file will be added to

    Preconditions:
    -file in the representation

    Creates:
    -<file_name>.jpg in the working dir
    """

    name = "convert.tif_to_jpg"
    label = "Convert TIF to JPG"
    description = "Converts TIF files into JPG files."

    def process_file(self, file, target_dir):
        convert_tif_to_jpg(file, _get_target_file(file, target_dir, 'jpg'))


class PdfToTxtTask(FileTask):
    """
    Extract text from a pdf and create a txt file for every page.

    TaskParams:
    -str file: Path to the pdf file
    -str target: Name of the representation the created file will be added to

    Preconditions:
    -file in the representation

    Creates:
    -for each page in file:
        -page.<page_no>.txt
    """

    name = "convert.pdf_to_txt"
    label = "Convert PDF to TXT"
    description = "Converts PDF files into TXT files."

    def process_file(self, file, target_dir):
        convert_pdf_to_txt(file, target_dir)


class PdfToTifTask(FileTask):
    """
    Create a tif file for every page of a pdf.

    TaskParams:
    -str file: The path to the pdf file
    -str target: Name of the representation the created files will be added to

    Preconditions:
    -file in the representation

    Creates:
    -for each page in file:
        -<page_no>.tif
    """

    name = "convert.pdf_to_tif"
    label = "Convert PDF to TIF"
    description = "Converts PDF files into TIF files."

    def process_file(self, file, target_dir):
        convert_pdf_to_tif(file, target_dir)


class TifToTxtTask(FileTask):
    """
    Do OCR on a tif file and save the results as txt.

    TaskParams:
    -str file: The path of the tif file
    -str target: Name of the representation the created file will be added to

    Preconditions:
    -file in the representation

    Creates:
    -<file_name>.txt
    """

    name = "convert.tif_to_txt"
    label = "Convert TIF to TXT"
    description = "Converts TIF files into TXT files."

    def process_file(self, file, target_dir):
        lang = self.get_param("ocr_lang")
        tif_to_txt(file, _get_target_file(file, target_dir, 'txt'), lang)


class ScaleImageTask(FileTask):
    """
        Create copies of image files with new proportions.

        If selected the ratio will be kept.

        TaskParams:
        -str image_max_width: width of the generated image file
        -str image_max_height: height of the generated image file

        Preconditions:
        - image files existing in format JPEG or TIFF

        Creates:
        - scaled copies of images
    """

    name = "convert.scale_image"
    label = "Scale images"
    description = "Scales images."

    def _init_params(self, params):
        self.description = f"""
        Scales images to the maximum dimension of {params['max_width']} x {params['max_height']}.
        """
        super()._init_params(params)

    def process_file(self, file, target_dir):
        max_width = int(self.params['max_width'])
        max_height = int(self.params['max_height'])
        scale_image(file, target_dir, max_width, max_height)


class TifToPTifTask(FileTask):
    """
    Create copies of image files as PTIF.

    TaskParams:
    -str file: The path to the pdf file
    -str target: Name of the representation the created files will be added to

    Preconditions:
    -file in the representation

    Creates:
    - PTIF representation of all TIFFs
    """

    name = "convert.tif_to_ptif"
    label = "Convert TIF to PTIF"
    description = "Converts TIF files into PTIF files."

    def process_file(self, file, target_dir):
        convert_tif_to_ptif(file, target_dir)


ScaleImageTask = celery_app.register_task(ScaleImageTask())
JpgToPdfTask = celery_app.register_task(JpgToPdfTask())
MergeConvertedPdf = celery_app.register_task(MergeConvertedPdfTask())
TifToJpgTask = celery_app.register_task(TifToJpgTask())
PdfToTifTask = celery_app.register_task(PdfToTifTask())
PdfToTxtTask = celery_app.register_task(PdfToTxtTask())
TifToTxtTask = celery_app.register_task(TifToTxtTask())
TifToPTifTask = celery_app.register_task(TifToPTifTask())
SetPdfMetadataTask = celery_app.register_task(SetPdfMetadataTask())
