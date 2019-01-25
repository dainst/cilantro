import logging
import os
import glob

from utils import mysql

log = logging.getLogger(__name__)


def add_book(book, object_id, username):
    """Write book data to Arachne-Database."""
    book_metadata = book.metadata.to_dict()
    author = (f"{book_metadata['creator']['lastname']}, "
              f"{book_metadata['creator']['firstname']}")
    page_count = len(glob.glob(book.get_representation_dir('origin') + '/*'))

    book_query = ("INSERT INTO arachne.buch"
                  "(DatensatzGruppeBuch, BearbeiterBuch, creatienDateTime, "
                  "creation, lastModified, Verzeichnis, "
                  "KurzbeschreibungBuch, BuchAuthor, BuchTitel, BuchJahr, "
                  "BuchSeiten, hasOcrText, hasMarcData) "
                  "VALUES(%s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, "
                  "CURRENT_TIMESTAMP, %s, %s, %s, %s, %s, %s, %s, %s)")
    book_args = ('Arachne', username + ' (via iDAI.workbench)', object_id,
                 book_metadata['abstract'], author, book_metadata['title'],
                 book_metadata['created'], page_count, 0, 1)

    return mysql.insert(book_query, book_args)


def add_pages(book_id, book_object, object_id, username):
    """Create database entries for pages and their images.

    Entries in 'buchseite' and 'marbilder' for every page, by calling internal
    methods '_add_page_to_db' and '_add_image_to_db'.
    """
    file_list = sorted(glob.glob(book_object.get_representation_dir('jpg') +
                                 '/*'))
    for i, file_path in enumerate(file_list):
        new_filename = (f"BOOK-{object_id}-{str(i)}_" +
                        f"{os.path.basename(file_path)}")

        page_id = _add_page_to_db(book_id, i, new_filename, username)
        _add_image_to_db(object_id, book_id, page_id, file_path, new_filename)


def _add_page_to_db(book_id, page_index, new_filename, username):
    """Create row for image in table 'buchseite'."""
    page_query = ("INSERT INTO arachne.buchseite"
                  "(FS_BuchID, DatensatzGruppeBuchseite, BearbeiterBuchseite, "
                  "creatienDateTime, creation, lastModified, "
                  "seite, seite_natuerlich, image, version) "
                  "VALUES(%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, "
                  "CURRENT_TIMESTAMP, %s, %s, %s, %s)")
    page_args = (book_id, 'Arachne', username + ' (via iDAI.workbench)',
                 page_index, page_index, new_filename, 0)
    return mysql.insert(page_query, page_args)


def _add_image_to_db(object_id, book_id, page_id, file_path, new_filename):
    """Create row for image in table 'marbilder'."""
    page_image_query = ("INSERT INTO arachne.marbilder"
                        "(FS_BuchID, FS_BuchseiteID, Dateiformat, "
                        "Dateigroesse, erstellt, geaendert, "
                        "DateinameMarbilder, BestandsnameMarbilder, Pfad, "
                        "PfadNeu)"
                        "VALUES(%s, %s, %s, %s, CURRENT_TIMESTAMP, "
                        "CURRENT_TIMESTAMP, %s, %s, %s, %s)")
    folder_name = _generate_folder_name(object_id, book_id)
    relative_ptif_path = os.path.join('bookscans', folder_name,
                                      os.path.splitext(new_filename)[0] +
                                      '.ptif')
    file_size = (os.stat(file_path).st_size + 1000 // 2) // 1000
    image_path = ("http://arachne.uni-koeln.de/images/stichwerke/" +
                  folder_name +
                  "/" +
                  new_filename)
    page_image_args = (book_id, page_id, 'jpg', file_size, new_filename,
                       object_id, image_path, relative_ptif_path)
    mysql.insert(page_image_query, page_image_args)


def _generate_folder_name(object_id, book_id):
    formatted_book_id = '{:06d}'.format(book_id)
    return f"BOOK-ZID{object_id}-AraID{formatted_book_id}"
