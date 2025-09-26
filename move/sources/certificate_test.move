#[test_only]
module certifyx::certificate_test {
    use std::string;
    use std::signer;
    use aptos_framework::account;
    use certifyx::certificate;

    #[test(admin = @0x1)]
    public fun test_initialize(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        certificate::initialize(&admin);
    }

    #[test(admin = @0x1, learner = @0x2)]
    public fun test_issue_certificate(admin: signer, learner: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        account::create_account_for_test(signer::address_of(&learner));
        
        certificate::initialize(&admin);
        
        certificate::issue_certificate(
            &admin,
            signer::address_of(&learner),
            string::utf8(b"John Doe"),
            string::utf8(b"Web Development"),
            string::utf8(b"Tech Institute")
        );
    }

    #[test(admin = @0x1, learner = @0x2)]
    public fun test_verify_certificate(admin: signer, learner: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        account::create_account_for_test(signer::address_of(&learner));
        
        certificate::initialize(&admin);
        
        certificate::issue_certificate(
            &admin,
            signer::address_of(&learner),
            string::utf8(b"John Doe"),
            string::utf8(b"Web Development"),
            string::utf8(b"Tech Institute")
        );

        let (is_valid, name, qualification, institution, _) = certificate::verify_certificate(
            signer::address_of(&admin),
            1
        );

        assert!(is_valid, 1);
        assert!(name == string::utf8(b"John Doe"), 2);
        assert!(qualification == string::utf8(b"Web Development"), 3);
        assert!(institution == string::utf8(b"Tech Institute"), 4);
    }
}