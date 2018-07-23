import os
import logging

import pdftotext
from io import BytesIO

import PyPDF2

from utils.object import Object


def convert_pdf_to_txt(source_file, output_dir):
    logging.getLogger(__name__).debug(f"Creating txt files from {source_file} "
                                      f"to {output_dir}")
    with open(source_file, "rb") as input_stream:
        pdf = pdftotext.PDF(input_stream)
        index = 1
        # Needed as pdftotext is not a Python list with .index() capability.
        for page in pdf:
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            output = open(os.path.join(output_dir, f'page.{index}.txt'), 'wb')
            output.write(page.encode('utf-8'))
            output.close()
            index = index + 1


def merge_pdf(file_paths, output_path):
    """
    Create a single pdf from multiple ones merged together

    :param generator file_paths: list of paths to the pdf files to be
        merged in order
    :param str output_path: path for the generated pdf file
    """
    if not file_paths:
        raise Exception('No files given to merge.')
    input_streams = []
    pdf_new = PyPDF2.PdfFileWriter()
    try:
        for file in file_paths:

            input_stream = open(file, "rb")
            input_streams.append(input_stream)
            pdf = PyPDF2.PdfFileReader(input_stream)

            for index in range(pdf.getNumPages()):
                pdf_new.addPage(pdf.getPage(index))
        with open(output_path, "wb") as output_stream:
            pdf_new.write(output_stream)
    finally:
        for input_stream in input_streams:
            input_stream.close()


def split_pdf(files, path: str):
    """
    Takes the pdf files from files and split/merges them into one. they need to be in the given path

    :param list files: list of the pdf files as dic {'file':,'range':[start,end]}
    :param string path: The path where the used files lie the created file go
    """

    new_pdf = PyPDF2.PdfFileWriter()
    for file in files:
        input_str = os.path.join(path, os.path.basename(file['file']))
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

    with open(os.path.join(path, 'merged.pdf'), 'wb+') as stream:
        new_pdf.write(stream)

    for file in files:
        file_path = os.path.join(path, os.path.basename(file['file']))
        if os.path.isfile(file_path):
            os.remove(file_path)
