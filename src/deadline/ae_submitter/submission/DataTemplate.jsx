function __generateDataTemplate() {
    var FrameStarts =
    {
        "name": "FrameStarts",
        "type": "STRING",
        "userInterface": {
            "control": "LINE_EDIT",
            "label": "Starting Frames",
            "groupLabel": "After Effects Settings"
        },
        "description": "The starting frames to render. E.g. 1,8,11",
        "minLength": 1
    }
    var FrameEnds =
    {
        "name": "FrameEnds",
        "type": "STRING",
        "userInterface": {
            "control": "LINE_EDIT",
            "label": "Ending Frames",
            "groupLabel": "After Effects Settings"
        },
        "description": "The starting frames to render. E.g. 10,18,21",
        "minLength": 1
    }
    var OutputPattern =
    {
        "name": "OutputPattern",
        "type": "STRING",
        "description": "Name for the output file.",
        "default": "Output_[####]"
    }
    var OutputFormat =
    {
        "name": "OutputFormat",
        "type": "STRING",
        "description": "File type.",
        "default": "png"
    }
    var CompName =
    {
        "name": "CompName",
        "type": "STRING",
        "description": "Selected composition to render."
    }
    var OutputFilePath =
    {
        "name": "OutputFilePath",
        "type": "PATH",
        "objectType": "DIRECTORY",
        "dataFlow": "OUT",
        "userInterface": {
            "control": "CHOOSE_DIRECTORY",
            "label": "Output File Path",
            "groupLabel": "After Effects Settings"
        },
        "description": "The render output path."
    }
    return {
        "FrameStarts": FrameStarts,
        "FrameEnds": FrameEnds,
        "OutputPattern" : OutputPattern,
        "OutputFormat": OutputFormat,
        "CompName": CompName,
        "OutputFilePath": OutputFilePath
    }
}

dcDataTemplate = __generateDataTemplate();