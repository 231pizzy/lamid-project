'use client'
import ImageModal from "@/Components/ImageModal";
import { Budget, JusticeSvg, Receipt, CalendarSvg } from "@/public/icons/icons.js";
import { useEffect, useState } from "react";

export function ExpenseTab({ teamId }) {
    const [teamGoals, setTeamGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalTaskBudget, setTotalTaskBudget] = useState(0);
    const [numberOfGoals, setNumberOfGoals] = useState(0)
    const [activeButton, setActiveButton] = useState('Invoice');
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    console.log("team data", teamGoals)

    useEffect(() => {
        const fetchTeamGoals = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/teamGoal?teamId=${teamId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTeamGoals(data);
                } else {
                    console.error('Failed to fetch team goals');
                }
            } catch (error) {
                console.error('Error fetching team goals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamGoals();
    }, [teamId]);

    useEffect(() => {
        // Calculate total task budget
        let sum = 0;
        teamGoals.forEach((goal) => {
            goal.tasks.forEach((task) => {
                if (task.taskBudget) {
                    // Remove commas and convert to number
                    const budget = parseInt(task.taskBudget.replace(/,/g, ''));
                    sum += budget;
                }
            });
        });
        setTotalTaskBudget(sum);

        // Calculate the number of goals for the team
        const numberOfGoals = teamGoals.length;
        setNumberOfGoals(numberOfGoals);
    }, [teamGoals]);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div style={{ padding: "30px", display: "flex" }}>
            {/* expense card */}
            <div style={{ width: "455px", height: "550px", top: "204px", left: "272px", borderRadius: "16px", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(251, 251, 251, 1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", marginLeft: "30px" }}>

                {/* expense and invoice */}
                <div style={{ width: "455px", height: "59px", top: "0.11px", borderRadius: "16px 16px 0px 0px", border: "0px 0px 2px solid rgba(239, 246, 255, 1)", backgroundColor: "rgba(239, 246, 255, 1)", alignContent: "center" }}>
                    <h3 style={{ fontWeight: "700", fontSize: "18px", lineHeight: "24.51px", color: "rgba(51, 51, 51, 1)", marginLeft: "24px" }}>EXPENSE & INVOICE</h3>
                </div>

                {/* Goal budget */}
                <div style={{ width: "455px", maxHeight: "468px", top: "74px", overflowY: "auto" }}>
                    <div style={{ width: "455px", height: "36px", padding: "8px 28px 8px 16px", marginTop: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)" }}>
                        <h4 style={{ fontFamily: "open sans", fontWeight: "600", fontSize: "14px", lineHeight: "20.47px", color: "rgba(51, 51, 51, 1)", alignContent: "center" }}>
                            GOAL BUDGET
                        </h4>
                    </div>
                    <div style={{ display: "flex", width: "455px", height: "124px", top: "36px", padding: "24px 16px 24px 16px", gap: "16px" }}>
                        <div style={{ background: "linear-gradient(90deg, #257AFB 0%, #234374 81.8%)", width: "111px", height: "76px", borderRadius: "8px", padding: "12px", gap: "16px", boxShadow: "0px 6px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                            <div style={{ display: "flex", justifyContent: 'space-between', color: "rgba(255, 255, 255, 1)", alignItems: "center" }}>
                                <h5 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", textAlign: "center" }}>Budget</h5>
                                <Budget />
                            </div>

                            <h4 style={{ font: "bold", fontWeight: "700", fontSize: "15px", lineHeight: "21.79px", color: "rgba(255, 255, 255, 1)", marginTop: "10px" }}>₦{totalTaskBudget.toLocaleString()}</h4>
                        </div>

                        <div style={{ width: "158px", height: "76px", borderRadius: "8px", border: "1px solid rgba(37, 122, 251, 0.5)", padding: "12px 16px", backgroundColor: "rgba(37, 122, 251, 0.1)", boxShadow: "0px 6px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                                <h5 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center", color: "rgba(51, 51, 51, 1)" }}>Total Expense</h5>
                                <Receipt style={{ color: "rgba(37, 122, 251, 1)", width: "14.32px", height: "18px" }} />
                            </div>
                            <h4 style={{ font: "bold", fontWeight: "700", fontSize: "14px", lineHeight: "19.07px", color: "rgba(37, 122, 251, 1)", marginTop: "10px" }}>₦0</h4>
                        </div>

                        <div style={{ width: "122px", height: "76px", borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "12px 16px", gap: "12px", color: "rgba(255, 255, 255, 1)", boxShadow: "0px 6px 12px 0px rgba(0, 0, 0, 0.04)" }}>
                            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                                <h5 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center", color: "rgba(51, 51, 51, 1)" }}>Balance</h5>
                                <JusticeSvg style={{ color: "rgba(37, 122, 251, 1)", width: "22.29px", height: "18px" }} />
                            </div>
                            <h4 style={{ font: "bold", fontWeight: "700", fontSize: "14px", lineHeight: "19.07px", color: "rgba(37, 122, 251, 1)", marginTop: "10px" }}>₦0</h4>
                        </div>
                    </div>

                    {/* Goal 1 */}
                    <div>
                        {teamGoals.map((goal, index) => {
                            // Calculate total budget
                            let totalBudget = 0;
                            goal.tasks.forEach((task) => {
                                if (task.taskBudget) {
                                    totalBudget += parseInt(task.taskBudget.replace(/,/g, ''));
                                }
                            });
                            return (
                                <div key={index} style={{ width: "455px", height: "158px", }}>
                                    <div style={{ height: "36px", padding: "8px 16px", gap: "10px", backgroundColor: "rgba(28, 29, 34, 0.06)" }}>
                                        <h2 style={{ color: "rgba(51, 51, 51, 1)", fontWeight: "600", fontSize: "14px", lineHeight: "20.4px" }}>GOAL - {index + 1} BUDGET & EXPENSE</h2>
                                    </div>
                                    <div style={{ width: "437px", height: "122px", padding: "24px", gap: "16px", display: "flex" }}>
                                        <div style={{ width: "119px", height: "74px", borderRadius: "8px", padding: "12px", gap: "16px", boxShadow: "0px 6px 12px 0px rgba(0, 0, 0, 0.04)", border: "1px solid rgba(37, 122, 251, 0.4)", backgroundColor: "rgba(37, 122, 251, 0.1)" }}>
                                            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                                                <h5 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center", color: "rgba(51, 51, 51, 1)" }}>Budget</h5>
                                                <Budget style={{ color: "rgba(37, 122, 251, 1)", width: "20px", height: "14.94px" }} />
                                            </div>

                                            <h4 style={{ font: "bold", fontWeight: "700", fontSize: "14px", lineHeight: "10.07px", color: "rgba(37, 122, 251, 1)", marginTop: "10px" }}>₦{totalBudget.toLocaleString()}</h4>
                                        </div>

                                        <div style={{ width: "119px", height: "74px", borderRadius: "8px", padding: "12px", gap: "16px", boxShadow: "0px 6px 12px 0px rgba(0, 0, 0, 0.04)", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                                                <h5 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center", color: "rgba(51, 51, 51, 1)" }}>Expense</h5>
                                                <Receipt style={{ color: "rgba(37, 122, 251, 1)", width: "15px", height: "18px" }} />
                                            </div>

                                            <h4 style={{ font: "bold", fontWeight: "700", fontSize: "14px", lineHeight: "10.07px", color: "rgba(37, 122, 251, 1)", marginTop: "10px" }}>₦0</h4>
                                        </div>

                                        <div style={{ width: "119px", height: "74px", borderRadius: "8px", padding: "12px", gap: "16px", boxShadow: "0px 6px 12px 0px rgba(0, 0, 0, 0.04)", border: "1px solid rgba(28, 29, 34, 0.1)", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                                            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                                                <h5 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center", color: "rgba(51, 51, 51, 1)" }}>Balance</h5>
                                                <JusticeSvg style={{ color: "rgba(37, 122, 251, 1)", width: "22.29px", height: "18px" }} />
                                            </div>

                                            <h4 style={{ font: "bold", fontWeight: "700", fontSize: "14px", lineHeight: "10.07px", color: "rgba(37, 122, 251, 1)", marginTop: "10px" }}>₦0</h4>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* end expense card */}


            <div style={{ width: "396px", height: "752px", top: "204px", left: "758px", borderRadius: "16px", border: "2px dotted rgba(28, 29, 34, 0.1)", marginLeft: "30px", backgroundColor: "rgba(251, 251, 251, 1)" }}>
                <div style={{ width: "397", height: "109px", borderRadius: "16px 16px 0px 0px", backgroundColor: "rgba(37, 122, 251, 0.08)", padding: "10px" }}>
                    <h2 style={{ fontWeight: "700", fontSize: "16px", lineHeight: "21.79px", color: "rgba(51, 51, 51, 1)" }}>ALL GOALS ({numberOfGoals})</h2>
                    <div style={{ width: "364", height: "40px", marginTop: "24px", left: '16px', borderRadius: "8px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "11px 16px", gap: "12px", backgroundColor: "rgba(255, 255, 255, 1)" }}>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "16px", maxHeight: "540px", overflowY: "auto" }}>
                    {teamGoals.length > 0 ? (
                        teamGoals.map((goal, index) => {
                            // Calculate total time bank for the goal
                            let totalTimeBankHours = 0;
                            let totalTimeBankMinutes = 0;
                            goal.tasks.forEach((task) => {
                                totalTimeBankHours += parseInt(task.hours);
                                if (task.minutes) {
                                    totalTimeBankMinutes += parseInt(task.minutes);
                                }
                            });
                            // Convert excess minutes to hours
                            totalTimeBankHours += Math.floor(totalTimeBankMinutes / 60);
                            totalTimeBankMinutes %= 60;

                            // Find the earliest start date for the goal
                            let earliestStartDate = new Date();
                            goal.tasks.forEach((task) => {
                                const taskStartDate = new Date(task.startDate);
                                if (taskStartDate < earliestStartDate) {
                                    earliestStartDate = taskStartDate;
                                }
                            });

                            return (
                                <div key={index} style={{ width: "348.83px", height: "220px", borderRadius: "12px", border: "1px solid rgba(37, 122, 251, 1)", padding: "16px", gap: "10px", backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", marginBottom: "14px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>

                                        <div style={{ backgroundColor: "rgba(28, 29, 34, 0.04)", height: "26px", width: "107px", borderRadius: "10px", padding: "4px 8px", gap: "10px", display: "flex", alignItems: "center" }}>
                                            <CalendarSvg style={{ color: "rgba(141, 141, 141, 1)", width: "13px", height: "13.33px" }} />
                                            <p style={{ color: "rgba(141, 141, 141, 1)", fontWeight: "600", fontSize: "13px", lineHeight: "17.7px" }}> {earliestStartDate.toLocaleDateString()}</p>
                                        </div>
                                        <h4 style={{ color: "rgba(191, 6, 6, 1)", fontWeight: "600", fontSize: "13px", lineHeight: "17.7px", cursor: "pointer" }}>View time usage {">"}</h4>
                                    </div>
                                    <div style={{ height: "91px" }}>
                                        <p style={{ color: "rgba(51, 51, 51, 1)", fontWeight: "600", fontSize: "16px", lineHeight: "21.79px" }}>{goal.goalName}</p>
                                    </div>
                                    <div style={{ width: "160px", height: "43px", gap: "12px", border: "1px solid rgba(28, 29, 34, 0.1)", padding: "12px", alignContent: "center", marginTop: "20px" }}>
                                        <p style={{ color: "rgba(51, 51, 51, 1)", fontWeight: "500", fontSize: "14px", lineHeight: "19.07px" }}>Goal Time - bank:</p>
                                        <p style={{ color: "rgba(37, 122, 251, 1)", fontWeight: "600", fontSize: "14px", lineHeight: "19.07px" }}> {totalTimeBankHours}hrs :{totalTimeBankMinutes}mins</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ width: "348.83px", height: "220px", borderRadius: "12px", border: "1px solid rgba(37, 122, 251, 1)", padding: "16px", gap: "10px", backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", marginBottom: "14px" }}>
                            {/* Render default content for empty teamGoals */}
                        </div>
                    )}

                </div>


            </div>

            {/* end of all goals card */}

            {/* GOAL INVOICE */}
            <div style={{ width: "702px", height: "668px", top: "204px", boxShadow: "0px 6px 12px 0px rgba(79, 79, 79, 0.08)", marginLeft: "30px" }}>
                <div style={{ border: "0px 0px 1px 0px solid rgba(28, 29, 34, 0.1)", width: "702px", height: "54px", padding: "16px", gap: "24px", alignContent: "center" }}>
                    <h2 style={{ fontWeight: "500", fontSize: "16px", lineHeight: "21.79px", color: "rgba(51, 51, 51, 1)" }}>GOAL INVOICE</h2>
                </div>
                {/* button */}
                <div style={{ backgroundColor: "rgba(247, 247, 247, 1)", display: "flex", justifyContent: "center", width: "700px", height: "51px", border: "0px 0px 1px solid rgba(28, 29, 34, 0.1)", padding: "8px 0px", gap: "16px" }}>
                    <div style={{ border: `1px solid rgba(28, 29, 34, 0.1)`, width: "88px", height: "35px", borderRadius: "8px", backgroundColor: activeButton === 'Expense' ? "rgba(191, 6, 6, 0.1)" : "rgba(255, 255, 255, 1)", padding: "8px 16px", gap: "10px", cursor: "pointer" }} onClick={() => handleButtonClick('Expense')}>
                        <h3 style={{ color: activeButton === 'Expense' ? "rgba(191, 6, 6, 1)" : "rgba(51, 51, 51, 1)", fontWeight: "500", fontSize: "14px", lineHeight: "19.07px" }}>Expense</h3>
                    </div>
                    <div style={{ border: `1px solid rgba(28, 29, 34, 0.1)`, width: "88px", height: "35px", borderRadius: "8px", backgroundColor: activeButton === 'Invoice' ? "rgba(191, 6, 6, 0.1)" : "rgba(255, 255, 255, 1)", padding: "8px 16px", gap: "10px", cursor: "pointer" }} onClick={() => handleButtonClick('Invoice')}>
                        <h3 style={{ color: activeButton === 'Invoice' ? "rgba(191, 6, 6, 1)" : "rgba(51, 51, 51, 1)", fontWeight: "500", fontSize: "14px", lineHeight: "19.07px" }}>Invoice</h3>
                    </div>
                </div>

                <div style={{ width: "703px", height: "443px", top: "105px" }}>
                    {/* Headings */}
                    <div style={{ height: "43px", border: "1px solid rgba(28, 29, 34, 0.1)", display: "flex", alignItems: "center", color: "rgba(93, 93, 93, 1)", justifyContent: "space-between" }}>
                        <div style={{ alignContent: "center", borderRight: "1px solid rgba(28, 29, 34, 0.1)", width: "150px", height: "43px" }}>
                            <h4 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center" }}>Assignee</h4>
                        </div>
                        <div style={{ alignContent: "center", borderRight: "1px solid rgba(28, 29, 34, 0.1)", width: "150px", height: "43px", }}>
                            <h4 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center" }}>Date & time</h4>
                        </div>
                        <div style={{ alignContent: "center", borderRight: "1px solid rgba(28, 29, 34, 0.1)", width: "133.6px", height: "43px", }}>
                            <h4 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center" }}>Purpose</h4>
                        </div>
                        <div style={{ alignContent: "center", borderRight: "1px solid rgba(28, 29, 34, 0.1)", width: "133.6px", height: "43px", }}>
                            <h4 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center" }}>Amount</h4>
                        </div>
                        <div style={{ alignContent: "center", width: "133.6px", height: "43px", }}>
                            <h4 style={{ fontWeight: "500", fontSize: "14px", lineHeight: "19.07px", textAlign: "center" }}>{activeButton === 'Expense' ? 'Receipt' : 'Status'}</h4>
                        </div>


                    </div>

                    {/* scroll div */}
                    <div style={{ width: "703px", maxHeight: "380px", top: "105px", overflowY: "auto" }}>
                        {/* 1 */}
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(28, 29, 34, 0.1)" }}>
                            <div style={{ height: "80px", width: "150px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>Obiora Kingsley</h4>
                            </div>
                            <div style={{ height: "80px", width: "150px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>12/02/23 (10:00am)</h4>
                            </div>
                            <div style={{ height: "80px", width: "133.6px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>Travels</h4>
                            </div>
                            <div style={{ height: "80px", width: "133.6px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>#20,000</h4>
                            </div>
                            <div style={{ height: "80px", width: "133.6px", alignItems: "center", display: "flex", justifyContent: "center" }}>
                                {activeButton === 'Invoice' ? (
                                    <div style={{ width: "60px", height: "34px", backgroundColor: "rgba(0, 128, 0, 0.1)", borderRadius: "4px", padding: "8px 16px", gap: "10px" }}>
                                        <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center", color: "rgba(0, 128, 0, 1)" }}>Paid</h4>
                                    </div>
                                ) : (
                                    // Render your receipt image here
                                    <img src="https://media.istockphoto.com/id/1420767944/vector/register-sale-receipt-isolated-on-white-background-cash-receipt-printed.jpg?s=612x612&w=0&k=20&c=eV7CDJK0DZgKo7KVlGTDJeVMN_2xybqIPvt1ATl_kkM=" alt="Receipt" style={{ width: "130px", height: "70px", borderRadius: "4px", cursor: "pointer" }} onClick={() => handleImageClick("https://media.istockphoto.com/id/1420767944/vector/register-sale-receipt-isolated-on-white-background-cash-receipt-printed.jpg?s=612x612&w=0&k=20&c=eV7CDJK0DZgKo7KVlGTDJeVMN_2xybqIPvt1ATl_kkM=")} />
                                )}
                            </div>
                            {showModal && <ImageModal open={showModal} imageUrl={modalImage} onClose={handleClose} />}
                        </div>

                        {/* 2 */}
                        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(28, 29, 34, 0.1)" }}>
                            <div style={{ height: "80px", width: "150px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>Obiora Kingsley</h4>
                            </div>
                            <div style={{ height: "80px", width: "150px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>12/02/23 (10:00am)</h4>
                            </div>
                            <div style={{ height: "80px", width: "133.6px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>Travels</h4>
                            </div>
                            <div style={{ height: "80px", width: "133.6px", borderRight: "1px solid rgba(28, 29, 34, 0.1)", alignContent: "center", }}>
                                <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center" }}>#20,000</h4>
                            </div>
                            <div style={{ height: "80px", width: "133.6px", alignItems: "center", display: "flex", justifyContent: "center" }}>
                                <div style={{ width: "87px", height: "34px", backgroundColor: "rgba(255, 0, 0, 0.1)", borderRadius: "4px", padding: "8px 16px", gap: "10px" }}>
                                    <h4 style={{ fontWeight: "500", fontSize: "13px", lineHeight: "17.7px", textAlign: "center", color: "rgba(255, 0, 0, 1)" }}>Not Paid</h4>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>


                <div>
                    {activeButton === 'Invoice' ? (
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "16px", }}>
                            <div style={{ width: "208px", height: "46px", borderRadius: "8px", padding: "12px", gap: "12px", backgroundColor: "rgba(255, 0, 0, 0.08)", alignContent: "center" }}>
                                <h3 style={{ color: "rgba(255, 0, 0, 1)", fontWeight: "600", fontSize: "16px", lineHeight: "21.79px" }}>Total Invoice Unpaid<span style={{ marginLeft: "10px" }}>4<span></span></span></h3>
                            </div>

                            <div style={{ width: "186px", height: "46px", borderRadius: "8px", padding: "12px", gap: "12px", backgroundColor: "rgba(0, 128, 0, 0.1)", alignContent: "center" }}>
                                <h3 style={{ color: "rgba(0, 128, 0, 1)", fontWeight: "600", fontSize: "16px", lineHeight: "21.79px" }}>Total Invoice Paid<span style={{ marginLeft: "10px" }}>4<span></span></span></h3>
                            </div>

                            <div style={{ width: "158px", height: "46px", borderRadius: "8px", padding: "12px", gap: "12px", background: "linear-gradient(90deg, #BF0606 0%, #450909 81.8%)", alignContent: "center" }}>
                                <h3 style={{ color: "rgba(255, 255, 255, 1)", fontWeight: "600", fontSize: "16px", lineHeight: "21.79px" }}>Total Invoice<span style={{ marginLeft: "10px" }}>12<span></span></span></h3>
                            </div>
                        </div>
                    ) : (
                        <div style={{display: "flex", justifyContent: "end", marginRight: "16px"}}>
                            <div style={{ width: "220px", height: "46px", borderRadius: "8px", padding: "12px", gap: "12px", backgroundColor: "rgba(0, 128, 0, 0.1)", alignContent: "center" }}>
                                <h3 style={{ color: "rgba(51, 51, 51, 1)", fontWeight: "600", fontSize: "16px", lineHeight: "21.79px" }}>Total Expense<span style={{ marginLeft: "10px", color: "rgba(255, 0, 0, 1)" }}>₦100,000</span></h3>
                            </div>
                        </div>
                    )}
                </div>


            </div>
            {/* end goal invoice */}
        </div>
    )
}