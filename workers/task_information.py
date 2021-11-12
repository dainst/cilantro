information = {
    "convert.merge_converted_pdf": {"label": "Merge converted PDF",
                                    "description": "Merges individual PDF files into one."},
    "convert.set_pdf_metadata": {"label": "Set PDF metadata",
                                 "description": "Sets PDF metadata based"},
    "convert.jpg_to_pdf": {"label": "Convert JPG to PDF",
                           "description": "Converts JPG files into PDF files."},
    "convert.tif_to_pdf": {"label": "Convert TIF to PDF",
                           "description": "Converts TIF files into PDF files."},
    "convert.tif_to_jpg": {"label": "Convert TIF to JPG",
                           "description": "Converts TIF files into JPG files."},
    "convert.pdf_to_txt": {"label": "Convert TIF to TXT",
                           "description": "Converts TIF files into TXT files."},
    "convert.pdf_to_tif": {"label": "Convert PDF to TIF",
                           "description": "Converts PDF files into TIF files."},
    "convert.tif_to_txt": {"label": "Convert TIF to TXT",
                           "description": "Converts TIF files into TXT files."},
    "convert.tif_to_ptif": {"label": "Convert TIF to PTIF",
                            "description": "Converts TIF files into PTIF files."},
    "convert.scale_image": {"label": "Scale images",
                            "description": "Scales images."},
    "publish_to_atom": {"label": "Add digital object",
                        "description": "Adds a 'digital object' for the current PDF in iDAI.archives / AtoM."},
    "publish_to_ojs": {"label": "Publish to OJS",
                       "description": "Publishes the current result in OJS."},
    "publish_to_omp": {"label": "Publish to OMP",
                       "description": "Publishes the current result in OMP."},
    "generate_frontmatter": {"label": "Generate frontmatter",
                             "description": "Generates an article frontmatter for OJS."},
    "create_object": {"label": "Create object",
                      "description": "Sets up metadata for further processing."},
    "create_complex_object": {"label": "Create complex object", "description": "Copies files from staging to working directories and sets up metadata for further processing."},
    "publish_to_repository": {"label": "Publish to repository",
                              "description": "Copies the current results into the data repository."},
    "publish_to_archive": {"label": "Publish to archive",
                           "description": "Copies the current results into the data archive."},
    "list_files": {"label": "File batch",
                   "description": "Group containing individual steps applied to individual files."},
    "cleanup_directories": {"label": "Cleanup",
                            "description": "Cleans up the internal directories."},
    "finish_chain": {"label": "Finish batch",
                     "description": ""},
    "finish_chord": {"label": "No label set for chord task",
                     "description": "No label set for chord task"},
    "generate_xml": {"label": "Generate XML",
                     "description": "Renders a XML file based on a given template."}
}


def get_label(name):
    if name in information:
        return information[name]["label"]
    return "Unknown Task"


def get_description(name):
    if name in information:
        return information[name]["description"]
    return "Unknown Task"
