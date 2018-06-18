import os

import PyPDF2


def cut_pdf(files, source, target):
    """
    Takes multiple pdf files, cuts them and merges them together
    :param List files: List of Dictionaries with keys 'file' and 'range'.
        Lists the different Files that needs to be merged.
    :param string source: The working directory where we find the different files to be merged
    :param string target: The created file path
    """

    pdf_new = PyPDF2.PdfFileWriter()
    input_streams = []
    for nr, article in enumerate(files):

        input_str = f"{source}/{article['file']}"
        input_stream = open(input_str, "rb")
        input_streams.append(input_stream)

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

    for input_stream in input_streams:
        input_stream.close()


def _set_output(article, nr):
    name = f"{article['file']}.{nr}.pdf"
    output = name.replace('/', '-').replace(' ', '-')

    return output
