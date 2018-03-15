# ojs-importer
a tool to mass import retrodigitalized journals into an ojs system

# installation notes
- clone to /var/www/pimport or similar
- configure apache to /var/www
- npm install
- create tmp and reports folder inside pimport
- create /var/www/chiron/data (file storage) and /var/www/ojs (OJS), can be empty for developing purposes
- create settings.php like settings.default.php and fill out
- reach importer with "DOMAIN/pimport", e.g. "localhost:123/pimport"
