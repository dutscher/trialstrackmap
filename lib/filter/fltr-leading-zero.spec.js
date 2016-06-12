describe("leadingZero", function () {
    //beforeEach(module("trialsTrackmap"));

    var $filter,
        filterName = "leadingZero"

    beforeEach(inject(function(_$filter_){
        $filter = _$filter_;
    }));

    describe("one", function () {
        it("should be awesome", function () {
            expect($filter(filterName)(10,2)).toBe("010")
        })
    })
})