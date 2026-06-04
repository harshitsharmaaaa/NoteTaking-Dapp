"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useNotes } from "@/hooks/useNotes";

export default function NotesPage() {
  const wallet = useWallet();
  const router = useRouter();
  const { loadNotes, createNote, updateNote, deleteNote } = useNotes();

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [editNote, setEditNote] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!wallet.connected) {
      router.push("/");
      return;
    }
    fetchNotes();
  }, [wallet.connected, router]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const result = await loadNotes();
      setNotes(result);
    } catch {
      showMsg("Failed to load notes", "error");
    }
    setLoading(false);
  };

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      showMsg("Title and content cannot be empty", "error");
      return;
    }
    if (title.trim().length > 100) {
      showMsg("Title cannot exceed 100 characters", "error");
      return;
    }
    if (content.trim().length > 1000) {
      showMsg("Content cannot exceed 1000 characters", "error");
      return;
    }
    setCreateLoading(true);
    try {
      await createNote(title.trim(), content.trim());
      showMsg("Note created successfully!", "success");
      setTitle("");
      setContent("");
      setShowCreate(false);
      await fetchNotes();
    } catch {
      showMsg("Error creating note", "error");
    }
    setCreateLoading(false);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      showMsg("Content cannot be empty", "error");
      return;
    }
    if (editContent.trim().length > 1000) {
      showMsg("Content cannot exceed 1000 characters", "error");
      return;
    }
    setUpdateLoading(true);
    try {
      await updateNote(editNote.account.title, editContent.trim());
      showMsg("Note updated!", "success");
      setEditNote(null);
      setEditContent("");
      await fetchNotes();
    } catch {
      showMsg("Error updating note", "error");
    }
    setUpdateLoading(false);
  };

  const handleDelete = async (note: any) => {
    setDeleteLoading(note.publicKey.toBase58());
    try {
      await deleteNote(note.account.title);
      showMsg("Note deleted", "success");
      await fetchNotes();
    } catch {
      showMsg("Error deleting note", "error");
    }
    setDeleteLoading(null);
  };

  const filteredNotes = notes.filter((n: any) =>
    n.account.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (!wallet.connected) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Notes</h1>
            <p className="mt-1 text-muted-foreground">
              {notes.length} note{notes.length !== 1 ? "s" : ""} on the
              blockchain
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreate(!showCreate);
              setEditNote(null);
            }}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover"
          >
            {showCreate ? "Cancel" : "+ New Note"}
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 animate-slide-up rounded-xl border px-5 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {showCreate && (
          <div className="mt-6 animate-slide-up rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Create New Note
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Title ({title.length}/100)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  maxLength={100}
                  className="mt-1.5 block w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Content ({content.length}/1000)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note..."
                  rows={4}
                  maxLength={1000}
                  className="mt-1.5 block w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setTitle("");
                    setContent("");
                  }}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-card-hover hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={
                    createLoading || !title.trim() || !content.trim()
                  }
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title..."
            className="block w-full rounded-xl border border-border bg-card px-5 py-3 text-foreground placeholder-muted outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-3 h-6 w-2/5 rounded bg-card-hover" />
                <div className="mb-2 h-4 w-full rounded bg-card-hover" />
                <div className="h-4 w-3/4 rounded bg-card-hover" />
              </div>
            ))
          ) : filteredNotes.length > 0 ? (
            filteredNotes.map((note: any) => {
              const isEditing = editNote?.publicKey.toBase58() === note.publicKey.toBase58();
              return (
                <div
                  key={note.publicKey.toBase58()}
                  className="animate-slide-up rounded-xl border border-border bg-card p-6 transition-all hover:border-border-hover"
                  style={{ animationDelay: "0.05s" }}
                >
                  {isEditing ? (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {note.account.title}
                      </h3>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        maxLength={1000}
                        className="mt-3 block w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <div className="mt-4 flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setEditNote(null);
                            setEditContent("");
                          }}
                          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-card-hover hover:text-foreground"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={updateLoading || !editContent.trim()}
                          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updateLoading ? (
                            <span className="flex items-center gap-2">
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                          {note.account.title}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditNote(note);
                              setEditContent(note.account.content);
                              setShowCreate(false);
                            }}
                            className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-card-hover hover:text-primary"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(note)}
                            disabled={
                              deleteLoading === note.publicKey.toBase58()
                            }
                            className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-danger-muted hover:text-danger"
                          >
                            {deleteLoading === note.publicKey.toBase58() ? (
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                        {note.account.content}
                      </p>
                      <div className="mt-4 flex gap-4 text-xs text-muted">
                        <span>
                          Created{" "}
                          {new Date(
                            note.account.createdAt.toNumber() * 1000,
                          ).toLocaleDateString()}
                        </span>
                        <span>
                          Updated{" "}
                          {new Date(
                            note.account.lastUpdated.toNumber() * 1000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-border p-16 text-center">
              <div className="text-5xl">📝</div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {search ? "No notes found" : "No notes yet"}
              </h3>
              <p className="mt-1 text-muted-foreground">
                {search
                  ? "Try a different search term"
                  : "Create your first note to get started"}
              </p>
              {!search && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover"
                >
                  Create Note
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
