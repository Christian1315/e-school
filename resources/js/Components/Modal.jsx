import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useEffect, useRef } from 'react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    // -----------------------------
    // DATATABLE CONFIGURATION
    // -----------------------------
    const tableRef = useRef(null);
    const dtInstance = useRef(null);

    useEffect(() => {
        if (show) {
            // Wait for HeadlessUI transition before initializing DataTable
            setTimeout(() => {
                if (tableRef.current && !dtInstance.current) {
                    dtInstance.current = new DataTable(tableRef.current, {
                        pagingType: 'full_numbers',
                        responsive: true,
                        dom: `
                            <'dt-top d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-2'
                                <'dt-search mb-2 mb-sm-0'f>
                                <'dt-buttons text-sm-end'B>
                            >
                            <'table-responsive'tr>
                            <'d-flex flex-column flex-sm-row justify-content-between align-items-center mt-2'
                                i
                                p
                            >
                        `,
                        pageLength: 15,
                        order: [[0, 'desc']],
                        buttons: [
                            { extend: 'copy', className: 'btn btn-sm btn-primary', text: '<i class="fas fa-copy"></i> Copier' },
                            { extend: 'excel', className: 'btn btn-sm btn-success', text: '<i class="fas fa-file-excel"></i> Excel' },
                            { extend: 'pdf', className: 'btn btn-sm btn-danger', text: '<i class="fas fa-file-pdf"></i> PDF' },
                            { extend: 'print', className: 'btn btn-sm btn-warning', text: '<i class="fas fa-print"></i> Imprimer' }
                        ],
                        language: {
                            decimal: ",",
                            thousands: " ",
                            emptyTable: "Aucune donnée disponible",
                            info: "Affichage de _START_ à _END_ sur _TOTAL_ lignes",
                            infoEmpty: "Affichage de 0 à 0 sur 0 lignes",
                            infoFiltered: "(filtré de _MAX_ lignes au total)",
                            lengthMenu: "Afficher _MENU_ lignes",
                            loadingRecords: "Chargement...",
                            processing: "Traitement...",
                            search: "Rechercher :",
                            zeroRecords: "Aucun enregistrement trouvé",
                            paginate: {
                                first: "<<",
                                last: ">>",
                                next: "Suivant",
                                previous: "Précédent"
                            },
                            buttons: {
                                copy: "Copier",
                                excel: "Exporter Excel",
                                pdf: "Exporter PDF",
                                print: "Imprimer"
                            }
                        }
                    });
                }
            }, 80); // delay ensures modal is visible
        }

        // Cleanup when modal closes
        if (!show && dtInstance.current) {
            dtInstance.current.destroy();
            dtInstance.current = null;
        }
    }, [show]);
    // -----------------------------


    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={`mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full dark:bg-gray-800
                            ${maxWidthClass}
                            max-h-[90vh] overflow-y-auto`}
                    >
                        {/* HERE we wrap children in a ref for DataTable */}
                        <div>
                            {/* Table must be inside modal */}
                            {typeof children === "function"
                                ? children({ tableRef })
                                : children}
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
