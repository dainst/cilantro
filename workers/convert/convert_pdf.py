import logging
import os

import pdftotext
import PyPDF2
from wand.image import Image as WandImage


log = logging.getLogger(__name__)


def convert_pdf_to_tif(source_file, output_dir):
    """
    Create a TIF for every Page in the PDF and saves them to the output_dir.

    :param str source_file: path to the PDF
    :param str output_dir: path to the output Directory
    """
    log.debug(f"Creating tif files from {source_file} to {output_dir}")

    with WandImage(filename=source_file, resolution=200) as img:
        pages = len(img.sequence)
        for i in range(pages):
            with WandImage(img.sequence[i]) as page_img:
                page_img.type = 'truecolor'
                name = os.path.splitext(os.path.basename(source_file))[0]
                page_img.save(filename=os.path.join(output_dir,
                                                    f"{name}_{'%04i'% i}.tif"))


def convert_pdf_to_txt(source_file, output_dir):
    """
    Create text file for every page of source-PDF file.

    :param str source_file: PDF to generate text files from
    :param str output_dir: target directory for generated files
    """
    log.debug(f"Creating txt files from {source_file} to {output_dir}")
    with open(source_file, "rb") as input_stream:
        pdf = pdftotext.PDF(input_stream)
        index = 0
        # Needed as pdftotext is not a Python list with .index() capability.
        for page in pdf:
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            name = os.path.splitext(os.path.basename(source_file))[0]
            with open(os.path.join(output_dir, f'{name}_{"%04i"% index}.txt'),
                      'wb') as output:
                output.write(page.encode('utf-8'))
            index += 1


def split_merge_pdf(files, path: str, filename='merged.pdf', remove_old=True, metadata=None):
    """
    Create a PDF file by combining sections of other PDFs.

    File paths are relative to the path given in the parameters.

    :param list files: list of the source pdf files as dict in the format:
        {'file': relative_path, 'range': [start, end]}
    :param string path: The path to the dir where the created file go
    :param string filename: name of the generated pdf file
    :param bool remove_old: if True, remove the files used for the split/merge
    """
    os.makedirs(path, exist_ok=True)
    new_pdf = PyPDF2.PdfFileWriter()
    if metadata:
        logging.info(metadata)
        new_pdf.addMetadata(metadata)
    input_streams = []
    for file in files:
        input_str = os.path.join(path, file['file'])
        input_stream = open(input_str, 'rb')
        pdf = PyPDF2.PdfFileReader(input_stream)
        if pdf.flattenedPages is None:
            pdf.getNumPages()  # make the file page based

        if 'range' in file:
            start_end = file['range']
            for index in range(start_end[0] - 1, start_end[-1]):
                try:
                    new_pdf.addPage(pdf.getPage(index))
                except IndexError:
                    break
        else:
            for index in range(pdf.getNumPages()):
                new_pdf.addPage(pdf.getPage(index))
        input_streams.append(input_stream)

    with open(os.path.join(path, filename), 'wb+') as stream:
        new_pdf.write(stream)
        for input_stream in input_streams:
            input_stream.close()

    if remove_old:
        for file in files:
            file_path = os.path.join(path, os.path.basename(file['file']))
            if os.path.isfile(file_path):
                os.remove(file_path)
