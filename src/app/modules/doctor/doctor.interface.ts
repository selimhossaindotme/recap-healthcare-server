
export type IDoctorUpdateInput = {
    email: string;
    name: string;
    phoneNumber: string;
    appointmentFee: number;
    profilePicture: string | null;
    address: string | null;
    licenseNumber: string | null;
    registrationNumber: string | null;
    experienceYears: number | null;
    qualifications: string | null;
    designation: string | null;
    isDeleted: boolean;
    specialties: {
        specialitiesId: string;
        isDeleted?: boolean;
    }[]
}