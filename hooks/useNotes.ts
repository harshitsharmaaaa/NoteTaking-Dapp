import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { IDL, PROGRAM_ID } from "@/web3/Binary";
import { useCallback } from "react";

export function useNotes() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = useCallback(async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;
    const provider = new AnchorProvider(connection, wallet as any, {});
    return new Program(IDL as any, PROGRAM_ID, provider);
  }, [connection, wallet]);

  const getNoteAddress = useCallback(
    (title: string) => {
      if (!wallet.publicKey) return null;
      const [noteAddress] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("note"),
          wallet.publicKey.toBuffer(),
          Buffer.from(title),
        ],
        PROGRAM_ID,
      );
      return noteAddress;
    },
    [wallet.publicKey],
  );

  const loadNotes = useCallback(async () => {
    if (!wallet.publicKey) return [];
    const program = await getProgram();
    if (!program) return [];
    return await program.account.note.all([
      {
        memcmp: {
          offset: 8,
          bytes: wallet.publicKey.toBase58(),
        },
      },
    ]);
  }, [wallet.publicKey, getProgram]);

  const createNote = useCallback(
    async (title: string, content: string) => {
      if (!wallet.publicKey) return;
      const program = await getProgram();
      if (!program) return;
      const noteAddress = getNoteAddress(title);
      if (!noteAddress) return;
      await program.methods
        .createNote(title, content)
        .accounts({
          note: noteAddress,
          author: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    [wallet.publicKey, getProgram, getNoteAddress],
  );

  const updateNote = useCallback(
    async (title: string, content: string) => {
      if (!wallet.publicKey) return;
      const program = await getProgram();
      if (!program) return;
      const noteAddress = getNoteAddress(title);
      if (!noteAddress) return;
      await program.methods
        .updateNote(content)
        .accounts({ note: noteAddress, author: wallet.publicKey })
        .rpc();
    },
    [wallet.publicKey, getProgram, getNoteAddress],
  );

  const deleteNote = useCallback(
    async (title: string) => {
      if (!wallet.publicKey) return;
      const program = await getProgram();
      if (!program) return;
      const noteAddress = getNoteAddress(title);
      if (!noteAddress) return;
      await program.methods
        .deleteNote()
        .accounts({ note: noteAddress, author: wallet.publicKey })
        .rpc();
    },
    [wallet.publicKey, getProgram, getNoteAddress],
  );

  return { loadNotes, createNote, updateNote, deleteNote };
}
