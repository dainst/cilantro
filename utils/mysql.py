import os
import logging

import mysql.connector
from mysql.connector import Error as MySQLERROR

HOST = os.environ['ARACHNE_DB_HOST']
DATABASE = os.environ['ARACHNE_DB_NAME']
USER = os.environ['ARACHNE_DB_USER']
PASSWORD = os.environ['ARACHNE_DB_PASSWORD']


log = logging.getLogger(__name__)


def _get_connection():
    """Establish connection to database."""
    try:
        conn = mysql.connector.connect(host=HOST, database=DATABASE,
                                       user=USER, password=PASSWORD,
                                       auth_plugin='mysql_native_password')
        if conn.is_connected():
            log.debug('Connected to MySQL database')
        else:
            log.error('Connection to MySQL failed!')
    except MySQLERROR as e:
        log.error(e)

    return conn


def insert(query, args):
    """Commit INSERT query to database."""
    conn = _get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, args)
        log.debug(cursor.statement)
        if cursor.lastrowid:
            generated_id = cursor.lastrowid
        else:
            generated_id = None
        conn.commit()
        return generated_id
    except MySQLERROR as e:
        raise e
    finally:
        cursor.close()
        conn.close()


def query(query):
    """Commit query to database."""
    conn = _get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        log.debug(cursor.statement)
        rows = cursor.fetchall()
    except MySQLERROR as e:
        log.error(e)
    finally:
        cursor.close()
        conn.close()

    return rows


def delete(query):
    """Commit DELETE query to database."""
    conn = _get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query)
        log.debug(cursor.statement)
        conn.commit()
        log.debug("All Record Deleted successfully")
    except MySQLERROR as e:
        log.error("Failed to Delete all records from database table: {}"
                  .format(e))
    finally:
        cursor.close()
        conn.close()
