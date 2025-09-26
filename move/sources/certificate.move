module certifyx::certificate {
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::event;

    struct Certificate has key, store {
        id: u64,
        learner_address: address,
        learner_name: String,
        qualification: String,
        institution: String,
        issue_date: u64,
        admin_address: address,
    }

    struct CertificateStore has key {
        certificates: vector<Certificate>,
        next_id: u64,
    }

    #[event]
    struct CertificateIssued has drop, store {
        certificate_id: u64,
        learner_address: address,
        admin_address: address,
    }

    public entry fun initialize(admin: &signer) {
        let store = CertificateStore {
            certificates: vector::empty<Certificate>(),
            next_id: 1,
        };
        move_to(admin, store);
    }

    public entry fun issue_certificate(
        admin: &signer,
        learner_address: address,
        learner_name: String,
        qualification: String,
        institution: String,
    ) acquires CertificateStore {
        let admin_addr = signer::address_of(admin);
        let store = borrow_global_mut<CertificateStore>(admin_addr);
        
        let certificate = Certificate {
            id: store.next_id,
            learner_address,
            learner_name,
            qualification,
            institution,
            issue_date: timestamp::now_seconds(),
            admin_address: admin_addr,
        };

        vector::push_back(&mut store.certificates, certificate);
        
        event::emit(CertificateIssued {
            certificate_id: store.next_id,
            learner_address,
            admin_address: admin_addr,
        });

        store.next_id = store.next_id + 1;
    }

    #[view]
    public fun verify_certificate(admin_address: address, certificate_id: u64): (bool, String, String, String, u64) acquires CertificateStore {
        if (!exists<CertificateStore>(admin_address)) {
            return (false, string::utf8(b""), string::utf8(b""), string::utf8(b""), 0)
        };

        let store = borrow_global<CertificateStore>(admin_address);
        let len = vector::length(&store.certificates);
        let i = 0;

        while (i < len) {
            let cert = vector::borrow(&store.certificates, i);
            if (cert.id == certificate_id) {
                return (true, cert.learner_name, cert.qualification, cert.institution, cert.issue_date)
            };
            i = i + 1;
        };

        (false, string::utf8(b""), string::utf8(b""), string::utf8(b""), 0)
    }

    #[view]
    public fun get_learner_certificates(admin_address: address, learner_address: address): vector<u64> acquires CertificateStore {
        if (!exists<CertificateStore>(admin_address)) {
            return vector::empty<u64>()
        };

        let store = borrow_global<CertificateStore>(admin_address);
        let certificate_ids = vector::empty<u64>();
        let len = vector::length(&store.certificates);
        let i = 0;

        while (i < len) {
            let cert = vector::borrow(&store.certificates, i);
            if (cert.learner_address == learner_address) {
                vector::push_back(&mut certificate_ids, cert.id);
            };
            i = i + 1;
        };

        certificate_ids
    }
}