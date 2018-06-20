import os

import PyPDF2


def cut_pdf(files, source, target):
    """
    Make cuts out of multiple pdf files.

    :param list files: List of Dictionaries with keys 'file' and 'range'.
        Lists the different Files that need to be cut.
    :param str source: The working directory where we find the different files to be cut
    :param str target: The directory where the created files go
    """

    pdf_new = PyPDF2.PdfFileWriter()
    for nr, article in enumerate(files):

        input_str = f"{source}/{article['file']}"
        input_stream = open(input_str, "rb")

        pdf = PyPDF2.PdfFileReader(input_stream)
        if pdf.flattenedPages is None:
            pdf.getNumPages()  # make the file page based
        start_end = article['range']
        for index in range(start_end[0] - 1, start_end[1]):
            pdf_new.addPage(pdf.getPage(index))

        output_str = _set_output(article, nr)

        file_name = os.path.join(target, output_str)
        with open(file_name, "wb") as output_stream:
            pdf_new.write(output_stream)


def _set_output(article, nr):
    name = f"{article['file']}.{nr}.pdf"
    output = name.replace('/', '-').replace(' ', '-')

    return output
