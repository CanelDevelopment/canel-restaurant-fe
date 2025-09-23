import { DashboardHeading } from '@/components/admin/dashboard/dashboardHeading'
import { DashLogoButtons } from '@/components/admin/dashboard/dashlogobuttons'
import { PosContent } from '@/components/admin/dashboard/poscontent/posContent'
import { Box } from '@chakra-ui/react'
import React from 'react'

const PointOfSale: React.FC = () => {
    return (
        <>
            <Box width={["100%"]} bg="#f3f3f3">
                <DashLogoButtons />

                {/* Heading */}
                <DashboardHeading title="PUNTO DE VENTA (POS)" />
                <Box px={[0, 0, 8]} pb={3} rounded={"none"} >
                    <PosContent />
                </Box>
            </Box>
        </>
    )
}

export default PointOfSale