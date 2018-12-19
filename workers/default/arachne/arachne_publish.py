import logging
import os
import glob
import shutil
import zipfile

from utils import mysql

log = logging.getLogger(__name__)


PDF_FOLDER = 'aronscans/download-book'
METS_FOLDER = 'S-Arachne/MetsDocuments'
BOOKSCAN_PATH = 'aronscans/bookscans'
ARCHIVE_PATH = 'historical-books-archive/DAI'


def publish_pages(book_id, book, object_id, target_path):
    """
    Move images of pages to bookscan folder and to archive folder.

    Also create the target folders if not existing.
    """
    bookscan_path = os.path.join(target_path, BOOKSCAN_PATH, object_id)
    if not os.path.exists(bookscan_path):
        os.makedirs(bookscan_path)
    archive_dir_jpg = os.path.join(target_path, ARCHIVE_PATH,
                                   'BOOK' + '-ZID' + object_id + '-AraID' +
                                   '{:06d}'.format(book_id), 'datenbankfertig')
    if not os.path.exists(archive_dir_jpg):
        os.makedirs(archive_dir_jpg)

    file_list = sorted(glob.glob(book.get_representation_dir('jpg') + '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = ('BOOK' + '-' + object_id + '-' + str(i) + '_' +
                        os.path.basename(file_path))

        shutil.copy2(file_path, os.path.join(bookscan_path, new_filename))
        shutil.copy2(file_path, os.path.join(archive_dir_jpg, new_filename))

        page_id = _add_page_to_db(book_id, i, new_filename)
        _add_image_to_db(object_id, book_id, page_id, file_path, bookscan_path,
                         new_filename)


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


def _add_page_to_db(book_id, page_index, new_filename):
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
    page_image_query = ("INSERT INTO arachne.marbilder"
                        "(FS_BuchID, FS_BuchseiteID, Dateiformat, "
                        "Dateigroesse, erstellt, geaendert, "
                        "DateinameMarbilder, BestandsnameMarbilder, PfadNeu)"
                        "VALUES(%s, %s, %s, %s, CURRENT_TIMESTAMP, "
                        "CURRENT_TIMESTAMP, %s, %s, %s)")

    relative_image_path = os.path.join('bookscans',
                                       os.path.split(bookscan_path)[1],
                                       new_filename)
    file_size = (os.stat(file_path).st_size + 1000 // 2) // 1000
    page_image_args = (book_id, page_id, 'jpg', file_size, new_filename,
                       object_id, relative_image_path)
    mysql.insert(page_image_query, page_image_args)


def move_tiff_to_cloud(target_path, book, object_id, book_id):
    """
    Move TIFF-images of pages to archive folder.

    Also create the target folder if not existing.

    The files are renamed with the object_id and a continuous index.
    """
    archive_dir_tif = os.path.join(target_path, ARCHIVE_PATH,
                                   'BOOK' + '-ZID' + object_id + '-AraID' +
                                   '{:06d}'.format(book_id), 'Rohscans')
    if not os.path.exists(archive_dir_tif):
        os.makedirs(archive_dir_tif)
    file_list = sorted(glob.glob(book.get_representation_dir('origin') + '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = ('BOOK' + '-' + object_id + '-' + str(i) + '_' +
                        os.path.basename(file_path))
        shutil.copy2(file_path, os.path.join(archive_dir_tif, new_filename))


def move_mets_to_cloud(target_path, book, object_id):
    """
    Move book's METS-XML to cloud folder.

    Also create the target directory if not existing.
    """
    mets_dir = os.path.join(target_path, METS_FOLDER, object_id)
    if not os.path.exists(mets_dir):
        os.makedirs(mets_dir)
    try:
        mets_file_path = os.path.join(book.path, 'mets.xml')
        shutil.copy2(mets_file_path, mets_dir)
    except FileNotFoundError:
        log.error("Mets file not found!")


def move_pdf_to_cloud(target_path, book, object_id):
    """
    Move book's PDF to cloud folder.

    Also create the target directory if not existing.

    The PDF is zipped before being copied over and renamed with the object_id.
    """
    pdf_file = os.path.join(book.get_representation_dir('pdf'), 'merged.pdf')
    with zipfile.ZipFile(pdf_file + '.zip', mode='w') as myzip:
        myzip.write(pdf_file, os.path.basename(pdf_file))

    pdf_dir = os.path.join(target_path, PDF_FOLDER)
    if not os.path.exists(pdf_dir):
        os.makedirs(pdf_dir)
    source_path = os.path.join(book.get_representation_dir('pdf'),
                               'merged.pdf.zip')
    target_file_path = os.path.join(pdf_dir, object_id + '.pdf.zip')
    shutil.copy2(source_path, target_file_path)
