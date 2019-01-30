import logging

from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from workers.latex.frontmatter.frontmatter import Frontmatter

log = logging.getLogger(__name__)


class GenerateFrontmatterTask(ObjectTask):
    """
    Generate the frontmatter based on metadata using lualatex

    Creates:
    - frontmatter.pdf
    """

    name = "latex.generate_frontmatter"

    def process_object(self, obj):
        if 'create_frontpage' in obj.metadata.to_dict() and \
           obj.metadata.create_frontpage:
            f = Frontmatter(obj)
            f.generate_frontmatter(obj.path)


GenerateFrontmatterTask = celery_app.register_task(GenerateFrontmatterTask())
