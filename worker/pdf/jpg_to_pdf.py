import PIL
import PyPDF2


def convert_jpg_to_pdf(source_file, target_file):
    PIL.Image.Image.save(PIL.Image.open(source_file), target_file, 'PDF', resolution=100.0)


def pdf_merge(file_paths, output_path):
    """
    Create a single pdf from multiple ones merged together
    :param list file_paths: list of paths to the pdf files to be merged in order
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
