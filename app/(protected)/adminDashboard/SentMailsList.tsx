"use client"
import { fetchEmails } from "@/actions/emailfetch";
import { Newsletter } from "@prisma/client";
import { useEffect, useState } from "react";

interface SentMailsListProps {
    Status: (emailId: string) => void;
}

export default function SentMailsList({ Status }: SentMailsListProps) {
    const [emails, setEmails] = useState<Newsletter[]>([]);

    const getEmails = async () => {
        const data = await fetchEmails();
        if (data) {
            setEmails(data);
        }
    }

    useEffect(() => {
        getEmails();
    }, []);


    return (
        <>
            <div className="bg-gray-100 shadow overflow-hidden sm:rounded-md">
                <ul className="grid grid-cols-1 gap-y-2 gap-x-6 items-start p-6">
                    {emails.map((email) => (
                        <li key={email.id} className="max-w-3xl mt-2 p-6 bg-white shadow-md rounded-lg">
                            <h2 className="text-2xl font-bold mb-4"><span>Subject : </span>{" "}{email.subject || "Not available"}</h2>
                            <div>
                                <span>Template : </span>{" "}{email.template || "Not Available"}
                            </div>
                            <div>
                                <span className="font-semibold">Open Count:</span>{" "}
                                {email.openCount ?? "N/A"}
                            </div>
                            <button
                                onClick={() => Status(email.id)}
                                className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 mt-6"
                            >View stats
                                <svg className="overflow-visible ml-3 text-slate-300 group-hover:text-slate-400"
                                    width="3" height="6" viewBox="0 0 3 6" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M0 0L3 3L0 6"></path>
                                </svg></button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}