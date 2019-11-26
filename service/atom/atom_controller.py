from flask import Blueprint
from service.user.user_service import auth

from utils.atom_api import get_record

atom_controller = Blueprint('atom', __name__)


@atom_controller.route('/<atom_id>', methods=['GET'])
@auth.login_required
def get_atom_record(atom_id):
    """
    Get record from AtoM API.

    This is basically a proxy for the AtoM API. Since the authentication
    key is not supposed to be handled by the frontend, it done through the
    backend where the is not exposed.

    .. :quickref: AtoM Controller; Get record from AtoM API

    **Example request**:

    .. sourcecode:: http

        GET /atom/test HTTP/1.1

    **Example response SUCCESS**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "parent": "gr-d-dai-ath-archiv-nl",
            "reference_code": "GR D-DAI-ATH-Archiv NL-Duhn",
            "title": "Nachlass Duhn, Friedrich Carl von",
            "publication_status": "Draft",
            "level_of_description": "Subfonds",
            "extent_and_medium": "1 hellblaue Jurismappe mit losen Blättern",
            "dates": [
                {
                    "date": "1877",
                    "start_date": "1877-00-00",
                    "end_date": "1877-00-00",
                    "type": "Creation"
                }
            ],
            "creators": [
                {
                    "authotized_form_of_name": "Duhn, Friedrich Carl von "
                }
            ],
            "repository": "Deutsches Archäologisches Institut, Athen, Archiv",
            "repository_inherited_from": "Nachlässe",
            "scope_and_content": "Bericht über eine Reise im...",
            "name_access_points": [
                "Lolling, Habbo Gerhardus (1848–1894)"
            ]
        }

    :return: A JSON object containing the AtoM object
    """
    return get_record(atom_id)
