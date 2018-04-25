import os


def cut_pdf(data):
    articles = data['articles']
    for number, article in articles:
        (start, end) = _start_end(article['pages'])
        name = _set_name(data, articles, number)
        try:
            files = {
                "file": f"{os.environ['REPOSITORY_DIR']}/{article['filepath']}",
                "from": start,
                "to": end,
                "absolute": True
            }
        except NameError:
            print("Article without file")
        else:
            try:
                attached = article['attached']
                files = {**files, **attached}
            except NameError:
                pass

            merge_str = _merge_pdf_string(files)
            shell = f"pdftk {merge_str} output {os.environ['WORKING_DIR']}/{name} 2>&1"
            print(f"Excecuting shell command {shell}")
            pdftk = os.system(shell)
            if not (pdftk == ''):
                raise Exception(f"Pdftk occured an error using {shell}, it returns {pdftk}.")

            articles[number]['filepath'] = f"{os.environ['WORKING_DIR']}/{name}"


def _start_end(pages):
    start = pages['startPdf']
    try:
        end = pages['endPdf']
    except NameError:
        end = start

    return (start, end)


def _set_name(data, article, number):
    isdir = os.path.isdir(data['data']['importFilePath'])
    name = article['filepath'] if isdir else f"{article['filepath']}{number}.pdf"
    name = name.replace('/', '-').replace(' ', '-')

    return name


def _merge_pdf_string(files):
    handles = "ABCDEFGHIJKLMNOPQRTUVWXYZ"
    handle_def = []
    cut_def = []
    position = 0

    for file in files:
        position += 1
        if os.path.isfile(file['file']):
            handle = handles[position]
            if not file['absoulte']:
                file['file'] = f"{os.environ['REPOSITORY_DIR']}/{file['file']}"
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
