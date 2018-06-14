import os
import logging

import PyPDF2

log = logging.getLogger(__name__)


def cut_pdf(data, source, target):
    new_data = data
    articles = new_data['articles']
    for nr, article in enumerate(articles):
        try:
            article['filepath']
        except NameError:
            raise Exception("Article without file")
        else:
            files = _set_files(article)
            pdf_new = PyPDF2.PdfFileWriter()
            input_streams = []
            for file in files:
                input_str = f"{source}/{file['file']}"
                input_stream = open(input_str, "rb")
                input_streams.append(input_stream)
                pdf = PyPDF2.PdfFileReader(input_stream)
                if pdf.flattenedPages is None:
                    pdf.getNumPages()  # make the file page based
                start_end = _start_end(article['pages'])
                for index in range(start_end[0] - 1, start_end[1]):
                    pdf_new.addPage(pdf.getPage(index))
            output_str = _set_output(data, article, nr)

            file_name = os.path.join(target, output_str)
            with open(file_name, "wb") as output_stream:
                pdf_new.write(output_stream)
            for input_stream in input_streams:
                input_stream.close()

            new_data['articles'][nr]['filepath'] = f"{source}/{output_str}"  # Update Json Data

    return new_data


def _start_end(pages):
    start = pages['startPdf']
    try:
        end = pages['endPdf']
    except NameError:
        end = start

    return start, end


def _set_output(data, article, nr):
    isdir = os.path.isdir(data['data']['importFilePath'])

    name = article['filepath'] if isdir else f"{article['filepath']}.{nr}.pdf"
    output = name.replace('/', '-').replace(' ', '-')

    return output


def _set_files(article):
    (start, end) = _start_end(article['pages'])
    root_file = {
        "file": article['filepath'],
        "from": start,
        "to": end,
        "absolute": True
    }
    files = [root_file]
    try:
        attached = article['attached']
    except NameError:
        # no attached files, we can return only the root file
        pass
    else:
        for attached_file in attached:
            files.append(attached_file)

    return files
