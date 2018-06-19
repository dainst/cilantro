from workers.default.metadata.loader import write_metadata
from workers.base_task import BaseTask


class WriteMetadataTask(BaseTask):
    """
    Writes a metadata object provided as a dict param to disk

    Does nothing instead of creating a JSON file with an empty object if
    metadata param is empty.
    """

    name = "write_metadata"

    def execute_task(self):
        work_path = self.get_work_path()
        metadata = self.get_param('metadata')
        if metadata:
            write_metadata(work_path, metadata)
