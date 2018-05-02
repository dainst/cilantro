import os


def cut_pdf(data):
    articles = data['articles']
    for nr, article in enumerate(articles):
        (start, end) = _start_end(article['pages'])
        try:
            output = _set_output(data, article, nr)
            files = {
                "file": article['filepath'],
                "from": start,
                "to": end,
                "absolute": True
            }
        except NameError:
            print("Article without file")
        else:
            file_list = [files]
            try:
                attached = article['attached']
            except NameError:
                pass
            else:
                for attached_file in attached:
                    file_list.append(attached_file)
            merge_str = _merge_pdf_string(file_list)
            shell = f"pdftk {merge_str} output {os.environ['WORKING_DIR']}/{output} 2>&1"
            print(f"Excecuting shell command {shell}")
            # pdftk = os.system(shell)
            # if not (pdftk == ''):
            #     raise Exception(f"Pdftk occured an error using {shell}, it returns {pdftk}.")

            data['articles'][nr]['filepath'] = f"{os.environ['WORKING_DIR']}/{output}"
    return 'success'


def _start_end(pages):
    start = pages['startPdf']
    try:
        end = pages['endPdf']
    except NameError:
        end = start

    return (start, end)


def _set_output(data, article, nr):
    isdir = os.path.isdir(data['data']['importFilePath'])
    
    name = article['filepath'] if isdir else f"{article['filepath']}.{nr}.pdf"
    output = name.replace('/', '-').replace(' ', '-')

    return output


def _merge_pdf_string(files):
    handles = "ABCDEFGHIJKLMNOPQRTUVWXYZ"
    handle_def = []
    cut_def = []
    position = 0

    for file in files:
        try:
            file['absoulte']
        except KeyError:
            file['file'] = f"{os.environ['REPOSITORY_DIR']}/{file['file']}"
        handle = handles[position]
        position += 1
        if os.path.isfile(file['file']):
            handle_def.append(handle + '="' + file['file'] + '"')
            try:
                cut_def.append(f"{handle}{file['from']}-{file['to']}")
            except NameError:
                cut_def.append(handle)
        else:
            print(f"file {file['file']} could not be found")

    handle_def = " ".join(handle_def)
    cut_def = " ".join(cut_def)

    return (f"{handle_def} cat {cut_def}")
