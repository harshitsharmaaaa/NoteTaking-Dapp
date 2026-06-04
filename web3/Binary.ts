import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey("5VbB9hthf1DcTrrnM2cyvN9iqruj3k9CMyjDSmi74c2k")

export const IDL = {
  "version": "0.1.0",
  "name": "notes_dapp",
  "instructions": [
    {
      "name": "createNote",
      "accounts": [
        {
          "name": "note",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateNote",
      "accounts": [
        {
          "name": "note",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "author",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteNote",
      "accounts": [
        {
          "name": "note",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Note",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TitleTooLong",
      "msg": "Title cannot be longer than 100 chars"
    },
    {
      "code": 6001,
      "name": "ContentTooLong",
      "msg": "Content cannot be longer than 1000 chars"
    },
    {
      "code": 6002,
      "name": "TitleEmpty",
      "msg": "Title cannot be empty"
    },
    {
      "code": 6003,
      "name": "ContentEmpty",
      "msg": "Content cannot be empty"
    },
    {
      "code": 6004,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ]
};
