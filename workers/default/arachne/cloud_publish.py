import logging
import os
import glob
import shutil
import zipfile

log = logging.getLogger(__name__)


PDF_PATH = 'aronscans/download-book'
METS_PATH = 'S-Arachne/MetsDocuments'
TEI_PATH = 'S-Arachne/TeiDocuments'
PTIF_PATH = 'S-Arachne/arachne4scans/arachne4webimages/bookscans'
BOOKSCAN_PATH = 'aronscans/bookscans'
ARCHIVE_PATH = 'historical-books-archive/DAI'


def move_jpeg_to_cloud(object_id, book_id, book_object):
    """Move JPEG images to cloud.

    Move jpeg-images of pages to bookscan folder and to archive folder.
    Create the target folders if not existing.
    """
    bookscan_path = _get_target_path(BOOKSCAN_PATH, object_id, book_id)
    if not os.path.exists(bookscan_path):
        os.makedirs(bookscan_path)
    archive_dir_jpg = os.path.join(_get_target_path(ARCHIVE_PATH, object_id,
                                   book_id), 'datenbankfertig')
    if not os.path.exists(archive_dir_jpg):
        os.makedirs(archive_dir_jpg)

    file_list = sorted(glob.glob(book_object.get_representation_dir('jpg') +
                                 '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = _generate_file_name(object_id, i, file_path)
        shutil.copy2(file_path, os.path.join(bookscan_path, new_filename))
        shutil.copy2(file_path, os.path.join(archive_dir_jpg, new_filename))


def move_tiff_to_cloud(object_id, book_id, book_object):
    """
    Move TIFF-images of pages to archive folder.

    Also create the target folder if not existing.

    The files are renamed with the object_id and a continuous index.
    """
    archive_dir_tif = os.path.join(_get_target_path(ARCHIVE_PATH, object_id,
                                   book_id), 'Rohscans')
    if not os.path.exists(archive_dir_tif):
        os.makedirs(archive_dir_tif)
    file_list = sorted(glob.glob(book_object.get_representation_dir('origin') +
                                 '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = _generate_file_name(object_id, i, file_path)
        shutil.copy2(file_path, os.path.join(archive_dir_tif, new_filename))


def move_ptif_to_cloud(object_id, book_id, book_object):
    """
    Move PTIF-images of pages to archive folder.

    Also create the target folder if not existing.

    The files are renamed with the object_id and a continuous index.
    """
    archive_dir_ptif = _get_target_path(PTIF_PATH, object_id, book_id)
    if not os.path.exists(archive_dir_ptif):
        os.makedirs(archive_dir_ptif)
    file_list = sorted(glob.glob(book_object.get_representation_dir('ptif') +
                                 '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = _generate_file_name(object_id, i, file_path)
        shutil.copy2(file_path, os.path.join(archive_dir_ptif, new_filename))


# TODO rework when METS is available
# def move_mets_to_cloud(object_id, book_id, book_object):
#     """
#     Move book's METS-XML to cloud folder.
#
#     Also create the target directory if not existing.
#     """
#     target_file_name = os.path.join(METS_PATH,
#                                     'oai_arachne.uni-koeln.de_buch-' +
#                                     book_id + '.xml')
#     try:
#         mets_file_path = os.path.join(book_object.path, 'mets.xml')
#         shutil.copy2(mets_file_path, target_file_name)
#     except FileNotFoundError:
#         log.error("Mets file not found!")


def move_tei_to_cloud(object_id, book_id, book_object):
    """
    Move book's TEI-XML to cloud folder.

    Also create the target directory if not existing.
    """
    tei_dir = _get_target_path(TEI_PATH, object_id, book_id)
    if not os.path.exists(tei_dir):
        os.makedirs(tei_dir)
    try:
        tei_file_path = os.path.join(book_object.path, 'tei.xml')
        shutil.copy2(tei_file_path, os.path.join(tei_dir, 'transcription.xml'))
    except FileNotFoundError:
        log.error("TEI-XML file not found!")


def move_pdf_to_cloud(object_id, book_object):
    """
    Move book's PDF to cloud folder.

    Also create the target directory if not existing.

    The PDF is zipped before being copied over and renamed with the object_id.
    """
    pdf_file = os.path.join(book_object.get_representation_dir('pdf'),
                            'merged.pdf')
    with zipfile.ZipFile(pdf_file + '.zip', mode='w') as myzip:
        myzip.write(pdf_file, os.path.basename(pdf_file))

    pdf_dir = os.path.join(os.environ['ARCHAEOCLOUD_PATH'], PDF_PATH)
    if not os.path.exists(pdf_dir):
        os.makedirs(pdf_dir)
    source_path = os.path.join(book_object.get_representation_dir('pdf'),
                               'merged.pdf.zip')
    target_file_path = os.path.join(pdf_dir, object_id + '.pdf.zip')
    shutil.copy2(source_path, target_file_path)


def _generate_file_name(object_id, index, file_path):
    return f"BOOK-{object_id}-{str(index)}_{os.path.basename(file_path)}"


def _generate_folder_name(object_id, book_id):
    formatted_book_id = '{:06d}'.format(int(book_id))
    return f"BOOK-ZID{object_id}-AraID{formatted_book_id}"


def _get_target_path(path_name, object_id, book_id):
    cloud_path = os.environ['ARCHAEOCLOUD_PATH']
    return os.path.join(cloud_path, path_name,
                        _generate_folder_name(object_id, book_id))
