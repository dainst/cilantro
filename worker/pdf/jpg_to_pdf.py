import PIL
import PyPDF2


def jpg_to_pdf(source_file, target_file):
    PIL.Image.Image.save(PIL.Image.open(source_file), target_file, 'PDF', resolution=100.0)


def pdf_merge(file_paths, output_path):
    input_streams = []
    pdf_new = PyPDF2.PdfFileWriter()
    for file in file_paths:
        input_stream = open(file, "rb")
        input_streams.append(input_stream)
        pdf = PyPDF2.PdfFileReader(input_stream)
        if pdf.getNumPages() > 1:
            for index in pdf.getNumPages():
                pdf_new.addPage(pdf.getPage(index))
        else:
            pdf_new.addPage(pdf.getPage(0))

    with open(output_path, "wb") as output_stream:
        pdf_new.write(output_stream)
    for input_stream in input_streams:
        input_stream.close()
