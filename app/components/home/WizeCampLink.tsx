

export default function WizeCampLink({
    active,
    id,
    text,
    setActive
} : {
    active: string,
    id: string,
    text: string,
    setActive: (id: string) => void
}) {

    const setActiveId = (id: string) => {
        setActive(id);
    }

    return (
        <>
            <a href={`#${id}`} className={`
                        ${active === id ? "text-[#8C52FF]" : ""}
                        hover:text-[#8C52FF] 
                        transition-colors 
                        `} onClick={() => setActiveId(id)}>
                {text}
            </a>
        </>
    )
}