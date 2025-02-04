function __generateDataTemplate() {
    var FrameStart =
    {
        "name": "FrameStart",
        "type": "STRING",
        "userInterface": {
            "control": "LINE_EDIT",
            "label": "Starting Frames",
            "groupLabel": "After Effects Settings"
        },
        "description": "The starting frame to render.",
        "minLength": 1
    }
    var FrameEnd =
    {
        "name": "FrameEnd",
        "type": "STRING",
        "userInterface": {
            "control": "LINE_EDIT",
            "label": "Ending Frames",
            "groupLabel": "After Effects Settings"
        },
        "description": "The ending frame to render.",
        "minLength": 1
    }
    var ChunkSize =
    {
        "name": "ChunkSize",
        "type": "STRING",
        "userInterface": {
            "control": "LINE_EDIT",
            "label": "Frames Per Task",
            "groupLabel": "After Effects Settings"
        },
        "description": "The chunk size of frames per task to render",
        "minLength": 1
    }
    var FrameStartPlusChunkSizeMinusOne =
    {
        "name": "FrameStartPlusChunkSizeMinusOne",
        "type": "STRING",
        "userInterface": {
            "control": "LINE_EDIT",
            "label": "FrameStart + ChunkSize - 1",
            "groupLabel": "After Effects Settings"
        },
        "description": "[Internal] This value needs to equal FrameStart + ChunkSize - 1",
        "minLength": 1
    }
    var FrameEndMinusOne =
    {
        "name": "FrameEndMinusOne",
        "type": "STRING",
        "userInterface": {
            "control": "LINE_EDIT",
            "label": "FrameEnd - 1",
            "groupLabel": "After Effects Settings"
        },
        "description": "[Internal] This value needs to equal FrameEnd - 1",
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
        "FrameStart": FrameStart,
        "FrameEnd": FrameEnd,
        "ChunkSize": ChunkSize,
        "FrameStartPlusChunkSizeMinusOne": FrameStartPlusChunkSizeMinusOne,
        "FrameEndMinusOne": FrameEndMinusOne,
        "OutputPattern" : OutputPattern,
        "OutputFormat": OutputFormat,
        "CompName": CompName,
        "OutputFilePath": OutputFilePath
    }
}

dcDataTemplate = __generateDataTemplate();