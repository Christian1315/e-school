import React from 'react'
import {
    CBadge,
    CSidebar,
    CSidebarBrand,
    CSidebarHeader,
    CSidebarNav,
    CSidebarToggler,
    CNavGroup,
    CNavItem,
    CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilLayers, cilPuzzle, cilSpeedometer,cilSchool } from '@coreui/icons'

export default function SidebarMenu() {
    return (
        <CSidebar className="border-end" style={{ height: "100%", position: 'fixed', overflowY: 'scroll' }}>
            <CSidebarNav>
                {/* Les Ecoles */}
                <CNavGroup
                    toggler={
                        <>
                            <CIcon customClassName="nav-icon text-success" icon={cilSchool} /> Les Ecoles
                        </>
                    }
                >
                    <CNavItem href="#">
                        <span className="nav-icon ">
                            <span className="nav-icon-bullet text-danger"></span>
                        </span>
                        Nav dropdown item
                    </CNavItem>
                    <CNavItem href="#">
                        <span className="nav-icon">
                            <span className="nav-icon-bullet"></span>
                        </span>{' '}
                        Nav dropdown item
                    </CNavItem>
                </CNavGroup>

                <CNavItem href="#">
                    <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Nav item
                </CNavItem>
                <CNavItem href="#">
                    <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> With badge{' '}
                    <CBadge color="primary ms-auto">NEW</CBadge>
                </CNavItem>
                <CNavGroup
                    toggler={
                        <>
                            <CIcon customClassName="nav-icon" icon={cilPuzzle} /> Nav dropdown
                        </>
                    }
                >
                    <CNavItem href="#">
                        <span className="nav-icon">
                            <span className="nav-icon-bullet"></span>
                        </span>{' '}
                        Nav dropdown item
                    </CNavItem>
                    <CNavItem href="#">
                        <span className="nav-icon">
                            <span className="nav-icon-bullet"></span>
                        </span>{' '}
                        Nav dropdown item
                    </CNavItem>
                </CNavGroup>
                <CNavItem href="https://coreui.io">
                    <CIcon customClassName="nav-icon" icon={cilCloudDownload} /> Download CoreUI
                </CNavItem>
                <CNavItem href="https://coreui.io/pro/">
                    <CIcon customClassName="nav-icon" icon={cilLayers} /> Try CoreUI PRO
                </CNavItem>
            </CSidebarNav>
            <CSidebarHeader className="border-top">
                <CSidebarToggler />
            </CSidebarHeader>
        </CSidebar>
    )
}