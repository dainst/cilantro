import os
import logging
from PyPDF2 import PdfFileWriter, PdfFileReader

log = logging.getLogger(__name__)


def pypdf2_cut_pdf(data, source, target):
    articles = data['articles']

    for nr, article in enumerate(articles):
        try:
            article['filepath']
        except NameError:
            raise Exception("Article without file")
        else:
            files = _set_files(article)
            pdf_new = PdfFileWriter()

            # We need to close the streams after writing the files as pages are only references to the input stream.
            input_streams = []

            for file in files:
                input_str = f"{source}/{file['file']}"

                input_stream = open(input_str, "rb")
                input_streams.append(input_stream)

                pdf = PdfFileReader(input_stream)

                if pdf.flattenedPages is None:
                    pdf.getNumPages()  # make the file page based

                requested_pages = []
                start_end = _start_end(article['pages'])
                for index in range(start_end[0]-1, start_end[1]):
                    requested_pages.append(index)

                for num_page in requested_pages:
                    pdf_new.addPage(pdf.getPage(num_page))

            output_str = _set_output(data, article, nr)

            file_name = os.path.join(target, output_str)

            with open(file_name, "wb") as output_stream:
                pdf_new.write(output_stream)

            for input_stream in input_streams:
                input_stream.close()

            data['articles'][nr]['filepath'] = f"{source}/{output_str}"  # Update Json Data


def cut_pdf(data, source, target):
    articles = data['articles']
    for nr, article in enumerate(articles):
        try:
            article['filepath']
        except NameError:
            raise Exception("Article without file")
        else:
            files = _set_files(article)
            merge_str = _merge_pdf_string(files, source)
            output = _set_output(data, article, nr)
            shell = f"pdftk {merge_str} output {target}/{output} 2>&1"
            log.debug(f"Excecuting shell command {shell}")
            pdftk = os.system(shell)
            if not pdftk == 0:
                if pdftk == 32512:
                    raise Exception(f"Pdftk not installed")
                else:
                    raise Exception(f"Pdftk occured an error using {shell}, it returns {pdftk}.")

            data['articles'][nr]['filepath'] = f"{source}/{output}"


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


def _merge_pdf_string(files, source):
    handles = "ABCDEFGHIJKLMNOPQRTUVWXYZ"
    handle_def = []
    cut_def = []
    position = 0

    for file in files:
        try:
            file['absoulte']
        except KeyError:
            file['file'] = f"{source}/{file['file']}"
        handle = handles[position]
        position += 1
        if os.path.isfile(file['file']):
            handle_def.append(handle + '="' + file['file'] + '"')
            try:
                cut_def.append(f"{handle}{file['from']}-{file['to']}")
            except NameError:
                cut_def.append(handle)
        else:
            log.debug(f"file {file['file']} could not be found")

    handle_def = " ".join(handle_def)
    cut_def = " ".join(cut_def)
    return f"{handle_def} cat {cut_def}"


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
