export const InputIds = {
    SetColumns: 'setColumns',
    SetFieldsValue: 'setFieldsValue',
    Submit: 'submit'
}
export const OutputIds = {
    OnFinish: 'onFinish',
    OnFinishForRels: 'onFinishForRels',
    OnReset: 'onReset',
    OnValuesChange: 'onValuesChange'
}

export const GridColumSchema = {
    "colProps": {
        "type": "object",
    },
    "rowProps": {
        "type": "object",
    }
}
export const BasicColumSchema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "key": {
                "type": "string"
            },
            "title": {
                "type": "string"
            },
            "tooltip": {
                "type": "string"
            },
            "dataIndex": {
                "type": "string"
            },
            "valueType": {
                "type": "enum",
                "items": [
                    {
                        "type": "string",
                        "value": "text"
                    },
                    {
                        "type": "string",
                        "value": "radio"
                    },
                    {
                        "type": "string",
                        "value": "checkbox"
                    },
                    {
                        "type": "string",
                        "value": "select"
                    },
                    {
                        "type": "string",
                        "value": "date"
                    },
                    {
                        "type": "string",
                        "value": "treeSelect"
                    },
                    {
                        "type": "string",
                        "value": "group"
                    },
                    {
                        "type": "string",
                        "value": "其他各类表单项"
                    }
                ]
            },
            "fieldProps": {
                "type": "object"
            },
            "formItemProps": {
                "type": "object"
            },
            "dependencies": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "columns": {
                "type": "array",
                "items": {
                    "type": "object"
                }
            },

        }
    }
}