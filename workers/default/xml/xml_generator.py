import logging
import os
import datetime
import glob
import json
import base64

from jinja2 import Environment, FileSystemLoader, select_autoescape

log = logging.getLogger(__name__)


def generate_xml(obj, template_file, target_filepath, params):
    """
    Build Jinja2 template and write it to target file.

    :param Object obj: The Cilantro Object to be used in the template
    :param str template_file: name of the template file to be used
    :param str target_filepath: name of the generated XML file
    :param dict params: task paramters (to be used in the template)
    :return str: Path to generated XML file
    """
    env = Environment(
        loader=FileSystemLoader('resources'),
        trim_blocks=True,
        lstrip_blocks=True,
        autoescape=True
    )

    # Some functions which may be needed in the template (logic)
    env.globals['path_join'] = os.path.join
    env.globals['datetime'] = datetime
    env.globals['basename'] = os.path.basename
    env.globals['splitext'] = os.path.splitext
    env.globals['getsize'] = os.path.getsize
    env.globals['environ'] = os.environ

    log.info("Generating XML with template: " + template_file)


    params['files'] = {}
    try: 
        input_file_directories = params["input_file_directories"]

        if 'pdfs' in input_file_directories:
            pdf_file_paths = {}
            encoded_pdf_file_paths = {}

            for pdf_dir in input_file_directories['pdfs']:

                pdf_files = glob.glob(obj.get_representation_dir(pdf_dir) + '/*.pdf')

                pdf_file_paths[pdf_dir] = pdf_files
                encoded_pdf_file_paths[pdf_dir] = []

                for file_path in pdf_files:
                    with open(file_path, "rb") as pdf_file:
                        encoded_pdf_file_paths[pdf_dir].append(base64.b64encode(pdf_file.read()).decode('utf-8'))

            params['files']['pdf'] = pdf_file_paths
            params['files']['pdf_base64'] = encoded_pdf_file_paths

    except KeyError:
        pdf_doc = os.path.join(obj.get_representation_dir('pdf'),
                            f"{obj.id}.pdf")
        with open(pdf_doc, "rb") as pdf_file:
            encoded_string = base64.b64encode(pdf_file.read())
        params['pdf_base64'] = encoded_string.decode('utf-8')

        jpegs = glob.glob(obj.get_representation_dir('jpg') + '/*.jpg')
        thumbnails = glob.glob(obj.get_representation_dir('jpg_thumbnails') + '/*.jpg')
        pdfs = glob.glob(obj.get_representation_dir('pdf') + '/*.pdf')

        if jpegs:
            params['files']['jpegs'] = jpegs

        if thumbnails:
            params['files']['thumbnails'] = thumbnails

        if pdfs:
            params['files']['pdfs'] = pdfs

    template = env.get_template(template_file)
    filled_template = template.render(obj=obj, params=params)

    _write_xml_to_file(filled_template, target_filepath)
    return os.path.join(target_filepath)


def _write_xml_to_file(template, target_filepath):
    log.debug("Saving XML file to" + os.path.join(target_filepath))
    with open(target_filepath, "w") as text_file:
        text_file.write(str(template))
