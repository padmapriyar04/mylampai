import { getNewsletter, getRecipentEmails } from "@/actions/emailfetch";
import { Newsletter } from "@prisma/client";
import { useEffect, useState } from "react";

interface EmailStatsProps { newsletterId: string; onBack: () => void };

interface Email {
    status: string;
    emailAddress: string;
    openedAt: Date | null;
}

export default function EmailStats({ newsletterId, onBack }: EmailStatsProps) {
    const [newsletter, setNewsletter] = useState<Newsletter>();
    const [recipentEmails, setRecipentEmails] = useState<Email[]>([]);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };
    const getData = async (id: string) => {
        const data = await getNewsletter(id);
        if (data) {
            setNewsletter(data[0]);
        }
    }

    const fetchEmails = async (id: string) => {
        const emails = await getRecipentEmails(id);
        if (emails) {
            setRecipentEmails(emails);
            console.log(emails);
        }
    }

    useEffect(() => {
        const data = getData(newsletterId);
        const emails = fetchEmails(newsletterId);
        console.log(newsletterId);
    }, [newsletterId]);


    if (!newsletter) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <button onClick={onBack} className="mb-4 px-4 py-2 text-base text-white bg-violet-500 rounded hover:bg-violet-400">Create new newsletter</button>
            <h2 className="text-2xl font-bold mb-4">Newsletter Details</h2>
            <div className="space-y-4">
                <div>
                    <span className="font-semibold">Subject : </span>{" "}{newsletter.subject || "Not available"}
                </div>
                <div>
                    <span className="font-semibold">Emails:</span>{" "}
                    {recipentEmails.length > 0
                        ? recipentEmails.map((emailobj, index) => (
                            <div key={index} className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown(index)}
                                    className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    aria-expanded={openDropdownIndex === index}
                                    aria-haspopup="true"
                                >
                                    {emailobj.emailAddress}
                                    <svg
                                        className="-mr-1 h-5 w-5 text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {openDropdownIndex === index && (
                                    <div
                                        className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button"
                                    >
                                        <div className="py-1">
                                            <div className="block px-4 py-2 text-sm text-gray-700">
                                                {"Status: "}
                                                {emailobj.status}
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <div className="block px-4 py-2 text-sm text-gray-700">
                                                {"Opened At: "}
                                                {emailobj.openedAt
                                                    ? new Date(emailobj.openedAt).toLocaleString()
                                                    : "NA"}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                        : "NA"}
                </div >
                <div>
                    <span className="font-semibold">Open Count:</span>{" "}{newsletter.openCount ?? "N/A"}
                </div>
                <div>
                    <span className="font-semibold">Content : </span>{" "}{newsletter.content || "Not Available"}
                </div>
                <div>
                    <label className="font-semibold">
                        Template sent:
                    </label>
                    <div
                        dangerouslySetInnerHTML={{ __html: newsletter.template || '' }}
                        className="p-4 border border-gray-300 rounded-lg bg-gray-300 h-96 overflow-y-scroll"
                    />
                </div>
                {/* <div>
                    <span className="font-semibold">Template : </span>{" "}{newsletter.template || "Not Available"}
                </div> */}
                <div>
                    <span className="font-semibold">Sent At:</span>{" "}
                    {new Date(newsletter.sentTimestamp).toLocaleString()}
                </div>
                
            </div>
        </div>
    )
}