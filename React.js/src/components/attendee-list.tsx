import { Search, MoreHorizontal, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { IconButton } from "./icon-button"
import { Table } from "./table/table"
import { TableHeader } from "./table/table-header"
import { TableCell } from "./table/table-cell"
import { TableRow } from "./table/table-row"
import { ChangeEvent, useEffect, useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.locale("pt-br")

interface Attendee {
    id: string,
    name: string,
    email: string,
    createdAt: string,
    checkedInAt: string | null,
}

export function AttendeeList() {
    const [searchInput, setSearchInput] = useState(() => {
        const url = new URL(window.location.toString())

        return url.searchParams.has("search") ? String(url.searchParams.get("search")) : ""
    })

    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

        return url.searchParams.has("page") ? Number(url.searchParams.get("page")) : 1
    });

    const [attendees, setAttendees] = useState<Attendee[]>([])

    const [total, setTotal] = useState(0)

    const totalPages = Math.ceil(total / 10)

    useEffect(() => {

        const url = new URL("http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees");

        url.searchParams.set("pageIndex", `${page - 1}`)

        if (searchInput.length > 0)
            url.searchParams.set("query", `${searchInput}`)

        fetch(url)
            .then(response => response.json())
            .then(data => { setAttendees(data.attendees); setTotal(data.totalAttendees) })
    }, [page, searchInput])


    function setCurrentPage(pageNumber: number) {
        const url = new URL(window.location.toString())

        url.searchParams.set('page', `${pageNumber}`)

        window.history.pushState({}, "", url.toString())

        setPage(pageNumber)
    }

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())

        url.searchParams.set('search', `${search}`)

        window.history.pushState({}, "", url.toString())

        setSearchInput(search)
    }

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {

        setCurrentSearch(event.target.value)

        setCurrentPage(1)
    }

    function goToFirstPage() { setCurrentPage(1) }
    function goToLastPage() { setCurrentPage(totalPages) }
    function goToNextPage() { setCurrentPage(page + 1) }
    function goToPreviousPage() { setCurrentPage(page - 1) }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bolds">Participantes</h1>
                <div className="px-3 border border-white/10 rounded-lg text-sm w-72 flex items-center gap-3">
                    <Search className="size-4 text-emerald-300" />
                    <input onChange={onSearchInputChanged} value={searchInput} className="bg-transparent py-1 flex-1 border-none outline-none focus:ring-0" placeholder="Buscar participante..." />
                </div>
            </div>

            <Table>
                <thead>
                    <TableRow>
                        <TableHeader style={{ width: 48 }}>
                            <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400" />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }}></TableHeader>
                    </TableRow>
                </thead>
                <tbody>
                    {
                        //attendees.slice((page - 1) * 10, page * 10).map(attendee => {
                        attendees.map(attendee => {
                            return (
                                <TableRow key={attendee.id}>
                                    <TableCell>
                                        <input type="checkbox" className="size-4 bg-black/20 rounded border border-w checked:bg-orange-400" />
                                    </TableCell>
                                    <TableCell>{attendee.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold  text-white">{attendee.name}</span>
                                            <span className="">{attendee.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(attendee.createdAt).toNow()}
                                    </TableCell>
                                    <TableCell>
                                        {attendee.checkedInAt == null ?
                                            <span className="text-zinc-500">Não fez check-in</span> :
                                            dayjs(attendee.checkedInAt).toNow()}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton transparent>
                                            <MoreHorizontal className="size-4" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </tbody>
                <tfoot >
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length + ((page - 1) * 10)} de {total} itens
                        </TableCell>
                        <TableCell colSpan={3} className="text-right">
                            <div className="inline-flex items-center gap-8">
                                <span>Pagina {page} de {totalPages}</span>

                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4" />
                                    </IconButton>

                                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                        <ChevronLeft className="size-4" />
                                    </IconButton>

                                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className="size-4" />
                                    </IconButton>

                                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                        <ChevronsRight className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}