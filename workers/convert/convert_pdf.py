import os
import logging

import pdftotext

import PyPDF2


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


def split_merge_pdf(files, path: str, filename='merged.pdf', remove_old=True):
    """
    Creates a PDF file by combining sections of other PDFs.

    File paths are relative to the path given in the parameters.

    :param list files: list of the source pdf files as dict in the format:
        {'file': relative_path, 'range': [start, end]}
    :param string path: The path to the dir where the created file go
    :param string filename: name of the generated pdf file.
    :param bool remove_old: if True, removes the files used for the split/merge.
    """
    os.makedirs(path, exist_ok=True)
    new_pdf = PyPDF2.PdfFileWriter()
    for file in files:
        input_str = file['file']
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

    with open(os.path.join(path, filename), 'wb+') as stream:
        new_pdf.write(stream)
    if remove_old:
        for file in files:
            file_path = os.path.join(path, os.path.basename(file['file']))
            if os.path.isfile(file_path):
                os.remove(file_path)
