import logging
import os
import glob
import shutil
import zipfile

from utils import mysql

log = logging.getLogger(__name__)


PDF_PATH = 'aronscans/download-book'
METS_PATH = 'S-Arachne/MetsDocuments'
PTIF_PATH = 'S-Arachne/arachne4scans/arachne4webimages/bookscans'
BOOKSCAN_PATH = 'aronscans/bookscans'
ARCHIVE_PATH = 'historical-books-archive/DAI'


def add_book_to_db(book, object_id):
    """Write book data to Arachne-Database."""
    book_metadata = book.metadata.to_dict()
    author = (f"{book_metadata['creator']['lastname']}, "
              f"{book_metadata['creator']['firstname']}")
    page_count = len(glob.glob(book.get_representation_dir('origin') + '/*'))

    book_query = ("INSERT INTO arachne.buch"
                  "(DatensatzGruppeBuch, BearbeiterBuch, creatienDateTime, "
                  "creation, lastModified, Verzeichnis, origFile, "
                  "KurzbeschreibungBuch, BuchAuthor, BuchTitel, BuchJahr, "
                  "BuchOrt, BuchSeiten, Materialbeschreibung, "
                  "ZusaetzlicheMasze, BuchMaszeBemerk, hasOcrText, "
                  "hasMarcData) "
                  "VALUES(%s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, "
                  "CURRENT_TIMESTAMP, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,"
                  " %s, %s, %s)")
    book_args = ('Arachne', 'cilantro', object_id, '',
                 book_metadata['abstract'], author, book_metadata['title'],
                 book_metadata['created'], '', page_count, '', '', '', 0, 0)

    return mysql.insert(book_query, book_args)


def publish_pages(book_id, book_object, object_id):
    """Move JPEG images to cloud and create database entries.

    Move jpeg-images of pages to bookscan folder and to archive folder.
    Create the target folders if not existing.

    Also create database entries in 'buchseite' and 'marbilder' for every
    page, by calling internal methods '_add_page_to_db' and '_add_image_to_db'.
    """
    bookscan_path = _get_target_path(BOOKSCAN_PATH, object_id, book_id)
    if not os.path.exists(bookscan_path):
        os.makedirs(bookscan_path)
    archive_dir_jpg = os.path.join(_get_target_path(ARCHIVE_PATH, object_id, book_id), 'datenbankfertig')
    if not os.path.exists(archive_dir_jpg):
        os.makedirs(archive_dir_jpg)

    file_list = sorted(glob.glob(book_object.get_representation_dir('jpg') + '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = _generate_file_name(object_id, i, file_path)

        shutil.copy2(file_path, os.path.join(bookscan_path, new_filename))
        shutil.copy2(file_path, os.path.join(archive_dir_jpg, new_filename))

        page_id = _add_page_to_db(book_id, i, new_filename)
        _add_image_to_db(object_id, book_id, page_id, file_path, bookscan_path,
                         new_filename)


def _add_page_to_db(book_id, page_index, new_filename):
    """Create row for image in table 'buchseite'."""
    page_query = ("INSERT INTO arachne.buchseite"
                  "(FS_BuchID, DatensatzGruppeBuchseite, BearbeiterBuchseite, "
                  "creatienDateTime, creation, lastModified, aliasBuchseite, "
                  "seite, seite_natuerlich, Originalpaginierung, image,"
                  "Folierung, MotivFrei, version) "
                  "VALUES(%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, "
                  "CURRENT_TIMESTAMP, %s, %s, %s, %s, %s, %s, %s, %s)")
    page_args = (book_id, 'Arachne', 'cilantro', '', page_index, page_index,
                 '', new_filename, '', '', 0)
    return mysql.insert(page_query, page_args)


def _add_image_to_db(object_id, book_id, page_id, file_path, bookscan_path,
                     new_filename):
    """Create row for image in table 'marbilder'."""
    page_image_query = ("INSERT INTO arachne.marbilder"
                        "(FS_BuchID, FS_BuchseiteID, Dateiformat, "
                        "Dateigroesse, erstellt, geaendert, "
                        "DateinameMarbilder, BestandsnameMarbilder, PfadNeu)"  # TODO Pfad?
                        "VALUES(%s, %s, %s, %s, CURRENT_TIMESTAMP, "
                        "CURRENT_TIMESTAMP, %s, %s, %s)")
    relative_ptif_path = os.path.join('bookscans', _generate_folder_name(object_id, book_id), os.path.splitext(new_filename)[0] + '.ptif')
    file_size = (os.stat(file_path).st_size + 1000 // 2) // 1000
    page_image_args = (book_id, page_id, 'jpg', file_size, new_filename,
                       object_id, relative_ptif_path)
    mysql.insert(page_image_query, page_image_args)


def move_tiff_to_cloud(object_id, book_id, book_object):
    """
    Move TIFF-images of pages to archive folder.

    Also create the target folder if not existing.

    The files are renamed with the object_id and a continuous index.
    """
    archive_dir_tif = os.path.join(_get_target_path(ARCHIVE_PATH, object_id, book_id), 'Rohscans')
    if not os.path.exists(archive_dir_tif):
        os.makedirs(archive_dir_tif)
    file_list = sorted(glob.glob(book_object.get_representation_dir('origin') + '/*'))
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
    file_list = sorted(glob.glob(book_object.get_representation_dir('ptif') + '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = _generate_file_name(object_id, i, file_path)
        shutil.copy2(file_path, os.path.join(archive_dir_ptif, new_filename))


def move_mets_to_cloud(object_id, book_id, book_object):
    """
    Move book's METS-XML to cloud folder.

    Also create the target directory if not existing.
    """
    mets_dir = _get_target_path(METS_PATH, object_id, book_id)
    if not os.path.exists(mets_dir):
        os.makedirs(mets_dir)
    try: # TODO file necessary?
        mets_file_path = os.path.join(book_object.path, 'mets.xml')
        shutil.copy2(mets_file_path, mets_dir)
    except FileNotFoundError:
        log.error("Mets file not found!")


def move_pdf_to_cloud(object_id, book_object):
    """
    Move book's PDF to cloud folder.

    Also create the target directory if not existing.

    The PDF is zipped before being copied over and renamed with the object_id.
    """
    pdf_file = os.path.join(book_object.get_representation_dir('pdf'), 'merged.pdf')
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
    formatted_book_id = '{:06d}'.format(book_id)
    return f"BOOK-ZID{object_id}-AraID{formatted_book_id}"

def _get_target_path(path_name, object_id, book_id):
    cloud_path = os.environ['ARCHAEOCLOUD_PATH']
    return os.path.join(cloud_path, path_name, _generate_folder_name(object_id, book_id))
