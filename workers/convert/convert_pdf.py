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


def set_pdf_metadata(obj):
    """
    Create a new PDF file with additional metadata.
    """

    pdf_metadata = {}
    if obj.job_type == 'ingest_archival_material':
        pdf_metadata = _create_pdf_metadata_archival_material(obj.metadata)
    else:
        log.warning(f'No PDF metadata definition for job type {obj.job_type}.')

    path = obj.path + "/data/pdf/" + obj.id + ".pdf"

    old_pdf = PyPDF2.PdfFileReader(path)
    new_pdf = PyPDF2.PdfFileWriter()
    new_pdf.cloneReaderDocumentRoot(old_pdf)
    new_pdf.addMetadata(pdf_metadata)

    with open(path, 'wb+') as stream:
        new_pdf.write(stream)


def _create_pdf_metadata_archival_material(metadata):
    pdf_metadata = {}
    if "title" in metadata:
        pdf_metadata["/Title"] = metadata["title"]
    if "atom_id" in metadata:
        pdf_metadata["/AtomID"] = metadata["atom_id"]

    if "authors" in metadata and len(metadata["authors"]) != 0:
        authors_string = ""
        count = 0
        for author in metadata['authors']:
            if count != 0:
                authors_string += ", "
            authors_string += author
            count += 1
        pdf_metadata["/Author"] = authors_string

    subject_string = ""
    if "scope_and_content" in metadata:
        subject_string += f"Scope and content:\n{metadata['scope_and_content']}\n\n"
    if "repository" in metadata:
        subject_string += f"Repository:\n{metadata['repository']}\n\n"
    if "reference_code" in metadata:
        subject_string += f"Reference code:\n{metadata['reference_code']}\n\n"

    if "creators" in metadata and metadata['creators'] != 0:
        creators_string = "Creators:\n"
        for creator in metadata['creators']:
            creators_string += f"{creator}\n"
        creators_string += "\n"
        subject_string += creators_string

    if "extent_and_medium" in metadata:
        subject_string += f"Extend and medium:\n{metadata['extent_and_medium']}\n\n"

    if "level_of_description" in metadata:
        subject_string += f"Level of description:\n{metadata['level_of_description']}\n\n"

    if "notes" in metadata and len(metadata["notes"]) != 0:
        for note in metadata["notes"]:
            nodes_string += f"{note}\n"
        nodes_string += "\n"
        subject_string += nodes_string

    # if len(self.dates) != 0:
    #     dates_string = ""
    #     count = 0
    #     for date in self.dates:
    #         if count != 0:
    #             dates_string += " | "
    #         dates_string += f"Date ({date.date_type}): "
    #         if date.date_start == date.date_end:
    #             dates_string += date.date
    #         else:
    #             dates_string += f"{date.date_start} - {date.date_end}"
    #         dates_string += "\n"
    #         count += 1
    #     dates_string += "\n"
    #     subject_string += dates_string

    if subject_string:
        pdf_metadata['/Subject'] = subject_string

    return pdf_metadata


def split_merge_pdf(files, path: str, filename='merged.pdf', remove_old=True):
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
