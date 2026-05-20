"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { off } from "process";
import { useEffect, useState } from "react";
import { buffer } from "stream/consumers";
const PROGRAM_ID = new PublicKey("5VbB9hthf1DcTrrnM2cyvN9iqruj3k9CMyjDSmi74c2k")

const IDL = {
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


export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [loading, setLoading] = useState(false);
  const [Createloading, setCreateLoading] = useState(false);
  const [deletedLoading,setDeleteLoading] = useState(false);
  const [UpdateLoading,setUpdateLoading] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [editNote,seteditNote] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  
  const gerProgram = async () => {
    if(!wallet.publicKey || !wallet.signTransaction) return;
    
    const provider = new AnchorProvider(connection, wallet as any, {});
    const program = new Program(IDL as any, PROGRAM_ID, provider);
    return program;
  };
  
  const getNoteAddress = async (title:string)=>{
    if(!wallet.publicKey || !wallet.signTransaction) return;
    const [noteAddress]= PublicKey.findProgramAddressSync([
      Buffer.from("note"),
      wallet.publicKey.toBuffer(),
      Buffer.from(title)
    ],PROGRAM_ID);
    return noteAddress;
  }

  const LoadNotes= async()=>{
    if(!wallet.publicKey) return;
    try {
      setLoading(true);
      const program = await gerProgram();
      if(!program) return;
      const notes = await program.account.note.all([
        {
          memcmp:{
            offset:8,
            bytes:wallet.publicKey.toBase58()
          }
        }
      ]);
      setNotes(notes);
      setMessage("");
    } catch (error) {
      console.log("Error Loading NOtes",error);
      setMessage("Error Loading Notes"); 
    }
    setLoading(false);
  }


  const CreateNote = async (title:string,content:string)=>{
    if(!title.trim().length || !content.trim().length) {
      setMessage("Title and Content cannot be empty");
      return;
    }
    if(title.trim().length > 100) {
      setMessage("Title cannot be longer than 100 chars");
      return;
    }
    if(content.trim().length > 1000) {
      setMessage("Content cannot be longer than 1000 chars");
      return;
    }
    if(!wallet.publicKey) return;
    try {
      setCreateLoading(true);
      
      const program = await gerProgram();
      if(!program) return;
      
      const noteAddress = await getNoteAddress(title);
      if(!noteAddress)return ;
      
      await program.methods.createNote(title,content).accounts({
        note:noteAddress,
        author:wallet.publicKey,
        systemProgram:SystemProgram.programId
      }).rpc();

      setMessage("Note Created");
      setTitle("");
      setContent("");
      await LoadNotes();
    } catch (error) {
      console.log("Error Creating Note",error);
      setMessage("Error Creating Note");
    }
    setCreateLoading(false);
  } 


  const UpdateNote = async (note:any)=>{
    
    if(!editContent) {
      setMessage("Content cannot be empty");
      return;
    };

    if(editContent.length > 1000) {
      setMessage("Content cannot be longer than 1000 chars");
      return;
    }
    setUpdateLoading(true);
    try {
      const program = await gerProgram();
      if(!program) return;

      const noteAddress = await getNoteAddress(note.account.title);
      if(!noteAddress)return ; 

      await program.methods.updateNote(editContent).accounts({
        note:noteAddress,
        author:wallet.publicKey,
      }).rpc();

      setMessage("Note Updated");
      setEditContent("");      
      seteditNote(null);
      await LoadNotes();
    } catch (error) {
      console.log("Error Updating Note",error);
      setMessage("Error Updating Note");
    }
    setUpdateLoading(false);
  }

  const DeleteNote = async (note:any)=>{
    setDeleteLoading(true);
    try {
      const program = await gerProgram();
      if(!program) return;

      const noteAddress = await getNoteAddress(note.account.title);
      if(!noteAddress)return ;

      await program.methods.deleteNote().accounts({
        note:noteAddress,
        author:wallet.publicKey,
      }).rpc();

      setMessage("Note Deleted");
      await LoadNotes();
    } catch (error) {
      console.log("Error Deleting Note",error);
      setMessage("Error Deleting Note");
    }
    setDeleteLoading(false);
  }

  useEffect(()=>{
    if(wallet.connected){
      LoadNotes();
    }
  },[wallet.connected]);

  if(!wallet.connected){
    return (
      <div className="flex justify-center items-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={wallet.connect}>Connect Wallet</button>
      </div>
    )
  }
  return (
    <div  className="text-gray-700">
      <div className="mb-6">
        <h2 className=" text-2xl mb-6 text-gray-800">
          Create New Note
        </h2>
        <div className="mb-4">
        <label className="text-sm block font-medium text-gray-700">Title ({title.length}/100)</label>
        <input type="text" name="Title" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="mb-4">
        <label className="text-sm block font-medium text-gray-700">Content ({content.length}/1000)</label>
        <textarea name="Content" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Content" rows={5} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="flex justify-end">
          <button disabled={Createloading ||!title.trim().length || !content.trim().length} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed "  onClick={()=>CreateNote(title,content)}>{Createloading?"Loading...":"Create Note"}</button>
        </div>
      </div>
      <div className="mt-6">
        <h2 className=" text-2xl tx-bold mb-6 text-gray-800">
          Your Notes
        </h2>
        {loading?<div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900">Loading Notes...</div>
        </div>:<div>
        {notes?.map((note:any)=>{
          return (
            <div className="mb-6 border-b border-gray-200 pb-6" key={note.account.Title}>
                <h3 className="text-xl font-bold">{note.account.title}</h3>
                <p className="text-gray-700">{note.account.content}</p>
                <div>
                  Created At :{" "}{new Date(note.account.createdAt*1000).toLocaleString()}
                  <br/>
                  Last Updated :{" "}{new Date(note.account.lastUpdated*1000).toLocaleString()}
                  {editNote?<div>
                    <textarea name="update-Content" value={editContent} className=" block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e)=>setEditContent(e.target.value)} maxLength={1000} placeholder="Write the content to update" rows={5}
                    ></textarea>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={UpdateLoading}
                    onClick={()=>{UpdateNote(note),seteditNote(null), setEditContent("")}}
                    >
                      {UpdateLoading?"Updating...":"Update"}
                    </button>
                  </div> :null}
                  {editNote? <div className="flex justify-end">
                    <button
                      onClick={()=>{
                        if(editNote){
                          seteditNote(null);
                        }
                        else{
                          seteditNote(note);
                          setEditContent(note.account.content);
                        }
                      }}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                      {editNote ?"Cancel Editing":"Delete"}
                    </button>
                  </div> :null}
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={loading}
                  onClick={()=>{seteditNote(note), setEditContent(note.account.content)}}
                  >
                    {loading?"Updating...":"Edit"}
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 disabled:bg-red-300 disabled:cursor-not-allowed"
                   disabled={deletedLoading }
                   onClick={()=>DeleteNote(note)}
                  >
                    {deletedLoading?"Deleting...":"Delete"}
                  </button>
                </div>
            </div>
          )
        })}
        </div>}
      </div>
    </div>
  );

}   
